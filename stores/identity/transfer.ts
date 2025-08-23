/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'
import { PrivateKeyWASM } from 'pshenmic-dpp'

import { WasmSdkBuilder } from '../../libs/dash/wasm_sdk.js'

import { useSystemStore } from '@/stores/system'

/**
 * Transfer
 *
 * Transfers assets from client to a recipient.
 */
export default async function (_receiver, _satoshis) {
    /* Initialize SYSTEM store. */
    const System = useSystemStore()

    /* Initialize locals. */
    let sdk

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

    // FIXME Validate asset ID and identity ID
console.log('WHAT IS ASSET ID ', this.assetid)
    const tokenBaseTransition = await sdk.tokens.createBaseTransition(this.assetid, this.id)
    const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, this.id, 'transfer', { identityId: _receiver, amount })

    /* Set private key. */
    const privKey = PrivateKeyWASM.fromWIF(this.wif.transfer)

    /* Set identity. */
    const identity = await sdk.identities.getIdentityByIdentifier(this.id)
    const identityPublicKeys = identity.getPublicKeys()
// console.log('PUBLIC KEYS', identityPublicKeys)

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
