/* Import modules. */
import { defineStore } from 'pinia'
// import { mnemonicToEntropy } from '@nexajs/hdnode'
// import { sendCoins } from '@nexajs/purse'

import { useSystemStore } from '@/stores/system'

import init, {
    WasmSdkBuilder,
    identity_fetch,
    get_identity_nonce,
    get_identity_balance,
    get_identity_token_balances,
    prefetch_trusted_quorums_mainnet,
    prefetch_trusted_quorums_testnet,

    data_contract_fetch,
    get_data_contracts,
} from '../libs/dash/wasm_sdk.js'

import { DashPlatformSDK } from 'dash-platform-sdk'
import {
    AssetLockProofWASM,
    OutPointWASM,
    PrivateKeyWASM,
} from 'pshenmic-dpp'


import _setEntropy from './identity/setEntropy.ts'

/* Set constants. */
// FIXME Move these constants to System.
const FEE_AMOUNT = 1000
const MAX_INPUTS_ALLOWED = 250

// FIXME FOR DEV PURPOSES ONLY
const DASH_PRICE = 21.64
const DUSD_PRICE = 1.00
const SANS_PRICE = 0.01

const DUSD_CONTRACT_ID = 'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd'
const TDUSD_CONTRACT_ID = '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz'
const SANS_CONTRACT_ID = 'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB'
const TSANS_CONTRACT_ID = 'A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw'


/**
 * Identity Store
 */
export const useIdentityStore = defineStore('identity', {
    state: () => ({
        /**
         * Asset ID
         *
         * The currently active asset ID.
         */
        _assetid: null,

        _assets: null,

        // _forceUI: null,

        /**
         * Entropy
         * (DEPRECATED -- MUST REMAIN SUPPORTED INDEFINITELY)
         *
         * Initialize entropy (used for HD wallet).
         *
         * NOTE: This is a cryptographically-secure "random"
         * 32-byte (256-bit) value.
         */
        _entropy: null,

        /**
         * Identity ID
         * (DEPRECATED -- MUST REMAIN SUPPORTED INDEFINITELY)
         *
         * Initialize entropy (used for HD wallet).
         *
         * NOTE: This is a cryptographically-secure "random"
         * 32-byte (256-bit) value.
         */
        _identityid: null,

        /**
         * Authority Private Key
         * (DEPRECATED -- MUST REMAIN SUPPORTED INDEFINITELY)
         *
         * Initialize entropy (used for HD wallet).
         *
         * NOTE: This is a cryptographically-secure "random"
         * 32-byte (256-bit) value.
         */
        _pkAuthority: null,

        /**
         * Authority Private Key
         * (DEPRECATED -- MUST REMAIN SUPPORTED INDEFINITELY)
         *
         * Initialize entropy (used for HD wallet).
         *
         * NOTE: This is a cryptographically-secure "random"
         * 32-byte (256-bit) value.
         */
        _pkTransfer: null,

        /**
         * Keychain
         *
         * Manages a collection of BIP-32 wallets.
         *
         * [
         *   {
         *     id        : '5be2e5c3-9d27-4b0f-bb3c-8b2ef6fdaafd',
         *     type      : 'studio',
         *     title     : `My Web Identity`,
         *     entropy   : 0x0000000000000000000000000000000000000000000000000000000000000000,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         *   {
         *     id        : 'f2457985-4b92-4025-be8d-5f11a5fc4077',
         *     type      : 'ledger',
         *     title     : `My Ledger Identity`,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         * ]
         */
        _keychain: null,

        /**
         * Identity
         *
         * Currently active Identity object.
         */
        _identity: null,
    }),

    getters: {
        /* Return (abbreviated) wallet status. */
        abbr(_state) {
            if (!_state._wallet) {
                return null
            }

            return _state._wallet.abbr
        },

        /* Return wallet status. */
        address(_state) {
            if (!_state._wallet) {
                return null
            }

            return _state._wallet.address
        },

        asset(_state) {
            if (!this.assets) {
                return null
            }

            return this.assets[this.assetid]
        },

        assetid(_state) {
            if (!this._assetid) {
                return null
            }

            return this._assetid
        },

        assets(_state) {
            if (!_state._assets) {
                return []
            }

            return _state._assets
        },

        /* Return Identity ID. */
        id(_state) {
            if (!_state._identityid) {
                return null
            }

            return _state._identityid
        },

        /* Return wallet status. */
        isLoading(_state) {
            if (!_state._identityid) {
                return true
            }

            return false
        },

        /* Return wallet status. */
        isReady(_state) {
            if (_state._entropy) {
                return true
            }

            if (_state._pkAuthority) {
                return true
            }

            if (_state._pkTransfer) {
                return true
            }

            return false
        },

        /* Return wallet instance. */
        wallet(_state) {
            return _state._wallet
        },

        /* Return WIF instance. */
        wif(_state) {
            return {
                auth: _state._pkAuthority,
                transfer: _state._pkTransfer,
            }
        },

        // IdentityStatus() {
        //     return IdentityStatus
        // },
    },

    actions: {
        /**
         * Initialize
         *
         * Setup the identity store.
         *   1. Retrieve the saved entropy.
         *   2. Initialize a Identity instance.
         *   3. Load assets.
         */
        async init() {
            console.info('Initializing identity...')

            /* Initialize locals. */
            let sdk

            if (typeof this.id === 'undefined' || this.id === null) {
                this._identityid = 'NEW' // FIXME TEMP NEW WALLET FLAG
                // throw new Error('Missing wallet entropy.')
                return console.error('Missing Identity.')
            }

            /* Initialize WASM module. */
            await init()

            /* Initialize SYSTEM store. */
            const System = useSystemStore()

            /* Handle network. */
            if (System.network === 'mainnet') {
                /* Pre-fretch trusted (MAINNET) quorums. */
                await prefetch_trusted_quorums_mainnet()

                /* Initialize SDK. */
                sdk = await WasmSdkBuilder
                    .new_mainnet_trusted()
                    .build()
            } else {
                /* Pre-fretch trusted (TESTNET) quorums. */
                await prefetch_trusted_quorums_testnet()

                /* Initialize SDK. */
                sdk = await WasmSdkBuilder
                    .new_testnet_trusted()
                    .build()
            }

    // FIXME FOR DEV PURPOSES ONLY
    // const identity = await identity_fetch(sdk, this.id)
    //     .catch(err => {
    //         console.error(err)
    //         console.error('HANDLE NOT FOUND!!')
    //     })
    // console.log('IDENTITY', identity.toJSON())
    // console.log('IDENTITY (token balance)', identity.balance)

    // FIXME FOR DEV PURPOSES ONLY
    // const test2 = await get_data_contracts(sdk, ['GWghYQoDFEb3osEfigrF7CKdZLWauxC7TwM4jsJyqa23'])
    //     .catch(err => {
    //         console.error(err)
    //         console.error('TEST2 NOT FOUND!!')
    //     })
    // console.log('TEST-2', test2)

    let balancesDusd
    let balancesSans

    const balanceCredit = await get_identity_balance(sdk, this.id)
    console.log('BALANCE (credits)', balanceCredit.balance)

// FIXME FOR DEV PURPOSES ONLY
/* Handle network. */
if (System.network === 'mainnet') {
    balancesDusd = await get_identity_token_balances(sdk, this.id, [DUSD_CONTRACT_ID])
        .catch(err => {
            console.error(err)
            console.error('DUSD NOT FOUND!!')
        })

    balancesSans = await get_identity_token_balances(sdk, this.id, [SANS_CONTRACT_ID])
        .catch(err => {
            console.error(err)
            console.error('SANS NOT FOUND!!')
        })
} else {
    balancesDusd = await get_identity_token_balances(sdk, this.id, [TDUSD_CONTRACT_ID])
        .catch(err => {
            console.error(err)
            console.error('DUSD NOT FOUND!!')
        })

    balancesSans = await get_identity_token_balances(sdk, this.id, [TSANS_CONTRACT_ID])
        .catch(err => {
            console.error(err)
            console.error('SANS NOT FOUND!!')
        })
}


    // FOR DEVELOPMENT PURPOSES ONLY
    if (System.network === 'mainnet') {
        this.setAssets({
            '0': {
                name: 'Dash Credit',
                ticker: 'DASH',
                iconUrl: '/icons/dash.svg',
                decimal_places: 11,
                amount: BigInt(balanceCredit?.balance || 0),
                satoshis: BigInt(111), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balanceCredit?.balance || 0)/10**11) * DASH_PRICE).toFixed(4),
                },
            },
            'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB': {
                name: 'Sansnote',
                ticker: 'SANS',
                iconUrl: '/icons/sans-AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB.svg',
                decimal_places: 8,
                amount: BigInt(balancesSans[0]?.balance || 0),
                // satoshis: BigInt(222), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balancesSans[0]?.balance || 0)/10**8) * SANS_PRICE).toFixed(4),
                },
            },
            'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd': {
                name: 'Dash USD',
                ticker: 'DUSD',
                iconUrl: '/icons/dusd-DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd.svg',
                decimal_places: 6,
                amount: BigInt(balancesDusd[0]?.balance || 0),
                // satoshis: BigInt(333), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balancesDusd[0]?.balance || 0)/10**6) * DUSD_PRICE).toFixed(4),
                },
            },
        })
    } else {
        this.setAssets({
            '0': {
                name: '[TEST] Dash Credit',
                ticker: 'tDASH',
                iconUrl: '/icons/dash.svg',
                decimal_places: 11,
                amount: BigInt(balanceCredit?.balance || 0),
                satoshis: BigInt(111), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balanceCredit?.balance || 0)/10**11) * DASH_PRICE).toFixed(4),
                },
            },
            'A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw': {
                name: '[TEST] Sansnote',
                ticker: 'tSANS',
                iconUrl: '/icons/sans-AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB.svg',
                decimal_places: 8,
                amount: BigInt(balancesSans[0]?.balance || 0),
                // satoshis: BigInt(222), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balancesSans[0]?.balance || 0)/10**8) * SANS_PRICE).toFixed(4),
                },
            },
            '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz': {
                name: '[TEST] Dash USD',
                ticker: 'tDUSD',
                iconUrl: '/icons/dusd-DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd.svg',
                decimal_places: 6,
                amount: BigInt(balancesDusd[0]?.balance || 0),
                // satoshis: BigInt(333), // IS THIS DEPRECATED??
                fiat: {
                    USD: (((balancesDusd[0]?.balance || 0)/10**6) * DUSD_PRICE).toFixed(4),
                },
            },
        })
    }

// FIXME FOR DEV PURPOSES ONLY
            this.setAsset('0')

            /* Request a wallet instance (by mnemonic). */
            // this._wallet = await Identity.init(this._entropy, true)
            // console.info('(Initialized) wallet', this.wallet)

            // this._assets = { ...this.wallet.assets } // cloned assets

            /* Set (default) asset. */
            // this.wallet.setAsset('0')

            /* Handle balance updates. */
//             this.wallet.on('balances', async (_assets) => {
//                 // console.log('Identity Balances (onChanges):', _assets)

//                 /* Close asset locally. */
// // FIXME Read ASSETS directly from library (getter).
//                 this._assets = { ..._assets }
//             })
        },

        async createIdentity(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            // if (_entropy.length !== 32 && _entropy.length !== 64) {
            //     console.error(_entropy, 'is NOT valid entropy.')

            //     _entropy = null
            // }

            /* Set entropy. */
            // _setEntropy.bind(this)(_entropy)

            /* Initialize wallet. */
            // this.init()





// With ChainLocks
const chain_locked_height = 2325021
const tx_id = '00000000000000135ce508cd5783daa69566c24a1112d0bee7aa1872ec155c51'
const outputIndex = 1

const outpoint = new OutPointWASM(tx_id, outputIndex)

const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(chain_locked_height, outpoint)
console.log('ASSET LOCK PROOF', assetLockProof)
console.log('ASSET LOCK PROOF (object)', assetLockProof.toObject())
console.log('ASSET LOCK PROOF (string)', assetLockProof.toString())
console.log('ASSET LOCK PROOF (lock type)', assetLockProof.getLockType())
// console.log('ASSET LOCK PROOF (instant)', assetLockProof.getInstantLockProof())
console.log('ASSET LOCK PROOF (regular)', assetLockProof.getChainLockProof())

            const publicKeys = [
              {
                id: 0,
                keyType: 'ECDSA_HASH160',
                purpose: 'AUTHENTICATION',
                securityLevel: 'MASTER',
                privateKeyHex: masterKey.private_key_hex,
                readOnly: false
              },
              {
                id: 1,
                keyType: 'ECDSA_HASH160',
                purpose: 'AUTHENTICATION',
                securityLevel: 'HIGH',
                privateKeyHex: authKey.private_key_hex,
                readOnly: false
              },
              {
                id: 2,
                keyType: 'ECDSA_HASH160',
                purpose: 'TRANSFER',
                securityLevel: 'CRITICAL',
                privateKeyHex: transferKey.private_key_hex,
                readOnly: false
              }
            ]

          // Handle identity create with asset lock proof
        //   result = await sdk.identityCreate(
        //     assetLockProof,
        //     privateKey,
        //     JSON.stringify(publicKeys)
        //   )


            return null
        },

        async createWallet(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            // if (_entropy.length !== 32 && _entropy.length !== 64) {
            //     console.error(_entropy, 'is NOT valid entropy.')

            //     _entropy = null
            // }

            /* Set entropy. */
            // _setEntropy.bind(this)(_entropy)

            /* Initialize wallet. */
            // this.init()
        },

        async transfer(_receiver, _satoshis) {
            /* Initialize locals. */
            let sdk

            // /* Validate transaction type. */
            // if (this.asset.group === '0') {
            //     /* Send coins. */
            //     return await this.wallet.send(_receiver, _satoshis)
            // } else {
            //     /* Send tokens. */
            //     return await this.wallet.send(this.asset.token_id_hex, _receiver, _satoshis)
            // }

            if (this.assetid === '0') {
console.log('SENDING DASH CREDITS')

                /* Initialize SYSTEM store. */
                const System = useSystemStore()

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

                const resultMe = await sdk.identityCreditTransfer(
                    this.id, // sender is the authenticated identity
                    _receiver,
                    BigInt(_satoshis),
                    this.wif.transfer,
                    null // key_id - will auto-select
                )
return
            }

console.log('SENDING TOKENS...')

            /* Handle network. */
            if (System.network === 'mainnet') {
                /* Initialize Dash Platform SDK. */
                sdk = new DashPlatformSDK({ network: 'mainnet' })
            } else {
                /* Initialize Dash Platform SDK. */
                sdk = new DashPlatformSDK({ network: 'testnet' })
            }

            // const tokenid = '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz' // tDUSD

            const publicKeyId = 3 // 03 => Transfer (Critical)

            // const owner = '34vkjdeUTP2z798SiXqoB6EAuobh51kXYURqVa9xkujf'
            // const recipient = _receiver//'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
// 'AFaVqRJCWXFZRUhuq6ZUUcWXVW8fErCN3wpEtgsBnDZm' // atlanta-degen-for-life
// '34vkjdeUTP2z798SiXqoB6EAuobh51kXYURqVa9xkujf' // NewMoneyHoney69
// HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR // Test-1
// 8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC // Test-2
            const amount = BigInt(_satoshis)

            /* Initialize stores. */
// const Identity = useIdentityStore()

// FIXME Validate asset ID and identity ID
console.log('WHAT IS ASSET ID ', this.assetid)
const tokenBaseTransition = await sdk.tokens.createBaseTransition(this.assetid, this.id)
const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, this.id, 'transfer', { identityId: _receiver, amount })

stateTransition.signByPrivateKey(PrivateKeyWASM.fromWIF(this.wif.transfer), 'ECDSA_SECP256K1')
stateTransition.signaturePublicKeyId = publicKeyId

console.log('STATE TRANSITION', stateTransition)
const response = await sdk.stateTransitions.broadcast(stateTransition)

            return response

        },

        broadcast(_receivers) {
            /* Broadcast to receivers. */
            return _broadcast.bind(this)(_receivers)
        },

        setAsset(_assetid) {
            this._assetid = _assetid
        },

        setAssets(_assets) {
            this._assets = _assets
        },

        setEntropy(_entropy) {
            this._entropy = _entropy
        },

        setMnemonic(_mnemonic) {
            let entropy
            let error

            try {
                /* Derive entropy. */
                entropy = mnemonicToEntropy(_mnemonic)
            } catch (err) {
                /* Set error message. */
                error = err.message
            }

            /* Validate error. */
            if (error) {
                return error
            }

            /* Set entropy. */
            this._entropy = entropy

            /* Create wallet. */
            this.createIdentity(entropy)

            /* Return entropy. */
            return this.wallet
        },

        setIdentity(_identityid) {
            /* Set entropy. */
            this._identityid = _identityid
        },

        setPkAuthority(_pkAuthority) {
            /* Set entropy. */
            this._pkAuthority = _pkAuthority
        },

        setPkTransfer(_pkTransfer) {
            /* Set entropy. */
            this._pkTransfer = _pkTransfer
        },

        destroy() {
            /* Reset identity. */
            this._entropy = null
            this._identityid = null
            this._pkAuthority = null
            this._pkTransfer = null

            console.info('Identity destroyed successfully!')
        },

        pshenmic() {
const chain_locked_height = 1312876
const tx_id = 'dcf15ac5ed31b066c2cfd8a921c4fc8b42c46ecc1d152d331856620246f54ad3'
const outputIndex = 0 // output index from your OP_RETURN

const outpoint = new OutPointWASM(tx_id, outputIndex)
console.log('OUTPUT', outpoint)

const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(chain_locked_height, outpoint)
console.log('ASSET LOCK PROOF', assetLockProof)
const assetLockProofHex = assetLockProof.hex()
console.log('ASSET LOCK PROOF (hex)', assetLockProofHex)

            return null

        },
    },
})
