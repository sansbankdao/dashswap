/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'
import {
    PrivateKeyWASM,
    IdentityCreditTransferWASM,
    TokenBaseTransitionWASM,
    TokenTransferTransitionWASM,
    TokenTransitionWASM,
    BatchedTransitionWASM,
    BatchTransitionWASM,
} from 'pshenmic-dpp'

import { WasmSdkBuilder } from '../../libs/dash/wasm_sdk.js'
import { getExtensionSigner } from '../../libs/dashconnect/extension'

import { useSystemStore } from '@/stores/system'

/**
 * The OWNING data contract for each token id the dApp trades. Contracts vs
 * tokens are TWO DIFFERENT identifiers (see dashswap-api TOKEN-IDS.md);
 * token transitions address the OWNING contract + the token id. Verified
 * live via the wasm-sdk getTokenContractInfo (2026-11-14).
 */
const OWNING_CONTRACTS = {
    /* SANS */
    'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB': {
        mainnet: 'ENDv6HL8MrkAhotcM5vBDaTy4ameZzyHN4MWB7mp13TR',
        testnet: '2EUW1Do3exKMDKaj9uh5jkPPSUcrMgXfWUraiz6ALrwP',
    },
    /* DUSD */
    'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd': {
        mainnet: '8CkcAPokwFdxEu2tUu2VdLTjgK3eeR1wUGJcxhjsWaDz',
        testnet: 'GWghYQoDFEb3osEfigrF7CKdZLWauxC7TwM4jsJyqa23',
    },
    /* tSANS (testnet artifact id) */
    'A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw': {
        testnet: '2EUW1Do3exKMDKaj9uh5jkPPSUcrMgXfWUraiz6ALrwP',
    },
    /* tDUSD (testnet artifact id) */
    '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz': {
        testnet: 'GWghYQoDFEb3osEfigrF7CKdZLWauxC7TwM4jsJyqa23',
    },
} as Record<string, Record<string, string>>

/**
 * Transfer
 *
 * Transfers assets from client to a recipient.
 *
 * TWO signing paths:
 *   - Browser wallet (Pshenmic Dash Platform Extension): the dApp BUILDS the
 *     state transition (pshenmic-dpp, byte-parity with the extension's own
 *     serializer) and hands the hex to `signer.signAndBroadcast` — the
 *     extension SIGNS and BROADCASTS in its own popup. Nonces are read live
 *     from DAPI via dash-platform-sdk's grpc-web (get_identity_nonce /
 *     get_identity_contract_nonce — verified supported).
 *   - Legacy local keys (entropy/WIF identity): unchanged behavior — signs
 *     locally with the user's own keys and broadcasts via the SDK. MUST
 *     REMAIN SUPPORTED INDEFINITELY.
 */
export default async function (_receiver, _satoshis) {
    /* Initialize SYSTEM store. */
    const System = useSystemStore()

    /* Initialize locals. */
    let sdk

    /* ---------- BROWSER WALLET PATH (extension session — no local WIF) ---------- */
    const extensionSigner = getExtensionSigner()

    if (extensionSigner !== null && !(this.wif && this.wif.transfer)) {
        /* The extension session's identity lives in the wallet; build the
         * unsigned transition here and let the user approve it. */
        const walletSdk = new DashPlatformSDK({ network: System.network })

        /* CREDIT transfer. */
        if (this.assetid === '0') {
            /* Identity-scoped nonce (live from DAPI). */
            const nonce = await walletSdk.identities.getIdentityNonce(this.id)

            const transition = new IdentityCreditTransferWASM(
                this.id,
                BigInt(_satoshis),
                _receiver,
                nonce,
                0,
            )

            /* The extension signs (with the wallet's own key selection) and
             * broadcasts. Returns {signedHash, signedBase64}. */
            return await extensionSigner.signAndBroadcast(transition.hex())
        }

        /* TOKEN transfer (batched token transition on the owning contract). */
        const owning = OWNING_CONTRACTS[this.assetid]?.[System.network]

        if (!owning) {
            throw new Error(`No owning contract known for token ${this.assetid} on ${System.network}.`)
        }

        /* Contract-scoped nonce for the (identity, owning-contract) pair —
         * live from DAPI (the sansbank proxy does not route this query; the
         * SDK reaches DAPI grpc-web directly). */
        const contractNonce = await walletSdk.identities.getIdentityContractNonce(this.id, owning)

        const tokenBase = new TokenBaseTransitionWASM(
            contractNonce,
            0, // token position within the contract
            owning,
            this.assetid,
        )

        const tokenTransfer = new TokenTransferTransitionWASM(
            tokenBase,
            _receiver,
            BigInt(_satoshis),
        )

        const batched = new BatchedTransitionWASM(
            new TokenTransitionWASM(tokenTransfer),
        )

        const batch = new BatchTransitionWASM(
            [batched],
            this.id,
            0, // userFeeIncrease
        )
        batch.setIdentityContractNonce(contractNonce)

        return await extensionSigner.signAndBroadcast(batch.hex())
    }

    /* ---------- LEGACY LOCAL-KEY PATH (entropy/WIF identity) ---------- */

    /* Validate CREDIT transaction type. */
    if (this.assetid === '0') {
        /* Handle network. */
        if (System.network === 'mainnet') {
            /* Initialize SDK. */
            sdk = await WasmSdkBuilder
                .new_mainnet_trusted()
                .build()
        } else {
            /* Initialize SDK. */
            sdk = await WasmSdkBuilder
                .new_testnet_trusted()
                .build()
        }

        /* Transfer credits. */
        const result = await sdk.identityCreditTransfer(
            this.id, // sender is the authenticated identity
            _receiver,
            BigInt(_satoshis),
            this.wif.transfer,
            null // key_id - will auto-select
        )

        return result
    }

    /* Handle network. */
    if (System.network === 'mainnet') {
        /* Initialize Dash Platform SDK. */
        sdk = new DashPlatformSDK({ network: 'mainnet' })
    } else {
        /* Initialize Dash Platform SDK. */
        sdk = new DashPlatformSDK({ network: 'testnet' })
    }

    /* Set transfer amount. */
    const amount = BigInt(_satoshis)

    const tokenBaseTransition = await sdk.tokens.createBaseTransition(this.assetid, this.id)
    const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, this.id, 'transfer', { identityId: _receiver, amount })

    /* Set private key. */
    const privKey = PrivateKeyWASM.fromWIF(this.wif.transfer)

    /* Set identity. */
    const identity = await sdk.identities.getIdentityByIdentifier(this.id)
    const identityPublicKeys = identity.getPublicKeys()

    /* Set public key ID. */
    const publicKeyId = 3 // 03 => Transfer (Critical)

    /* Set public key. */
    const pubKey = identityPublicKeys[publicKeyId]

    /* Assign public key ID. */
    stateTransition.signaturePublicKeyId = publicKeyId

    /* Sign state transition. */
    stateTransition.sign(privKey, pubKey)

    /* Broadcast state transition. */
    const response = await sdk.stateTransitions.broadcast(stateTransition)

    /* Return response. */
    return response
}
