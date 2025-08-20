/* Import modules. */
import { defineStore } from 'pinia'
// import { mnemonicToEntropy } from '@nexajs/hdnode'
// import { sendCoins } from '@nexajs/purse'

import init, {
    WasmSdkBuilder,
    identity_fetch,
    get_identity_nonce,
    get_identity_token_balances,
    prefetch_trusted_quorums_testnet,

    data_contract_fetch,
    get_data_contracts,
} from '../libs/dash/wasm_sdk.js'

import { DashPlatformSDK } from 'dash-platform-sdk'
import { PrivateKeyWASM } from 'pshenmic-dpp'

import _setEntropy from './identity/setEntropy.ts'

/* Set constants. */
// FIXME Move these constants to System.
const FEE_AMOUNT = 1000
const MAX_INPUTS_ALLOWED = 250

/* Initialize WASM module. */
await init()

/* Pre-fretch trusted (TESTNET) quorums. */
await prefetch_trusted_quorums_testnet()

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
            if (!_state._assets) {
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

            // if (this._entropy === null) {
            //     this._wallet = 'NEW' // FIXME TEMP NEW WALLET FLAG
            //     // throw new Error('Missing wallet entropy.')
            //     return console.error('Missing wallet entropy.')
            // }


            /* Initialize SDK. */
            const sdk = await WasmSdkBuilder
                .new_testnet_trusted()
                .build()
            console.log('SDK', sdk)

    // FIXME FOR DEV PURPOSES ONLY
    const identityid = '35SD29sWhmKEeQt1h87B2yXQVvBPDhevUYeubpAwGEow'

    // FIXME FOR DEV PURPOSES ONLY
    const identity = await identity_fetch(sdk, identityid)
        .catch(err => {
            console.error(err)
            console.error('HANDLE NOT FOUND!!')
        })
    console.log('IDENTITY', identity.toJSON())
    console.log('IDENTITY (token balance)', identity.balance)

    // FIXME FOR DEV PURPOSES ONLY
    const nonce = await get_identity_nonce(sdk, identityid)
        .catch(err => {
            console.error(err)
            console.error('NONCE NOT FOUND!!')
        })
    console.log('NONCE', nonce)

    // // FIXME FOR DEV PURPOSES ONLY
    // const test1 = await data_contract_fetch(sdk, 'GWghYQoDFEb3osEfigrF7CKdZLWauxC7TwM4jsJyqa23')
    //     .catch(err => {
    //         console.error(err)
    //         console.error('TEST1 NOT FOUND!!')
    //     })
    // console.log('TEST-1', test1.toJSON())

    // FIXME FOR DEV PURPOSES ONLY
    const test2 = await get_data_contracts(sdk, ['GWghYQoDFEb3osEfigrF7CKdZLWauxC7TwM4jsJyqa23'])
        .catch(err => {
            console.error(err)
            console.error('TEST2 NOT FOUND!!')
        })
    console.log('TEST-2', test2)

    // FIXME FOR DEV PURPOSES ONLY
    const balances = await get_identity_token_balances(sdk, identityid, ['3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz'])
        .catch(err => {
            console.error(err)
            console.error('TOKEN NOT FOUND!!')
        })
    console.log('BALANCES', balances)

            this.setAssets({
                '0': {
                    name: 'Dash Credit',
                    ticker: 'DASH',
                    iconUrl: '/icons/dash.svg',
                    decimal_places: 8,
                    amount: BigInt(1337000000),
                    satoshis: BigInt(111),
                    fiat: {
                        USD: 286.3854,
                    },
                },
                'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB': {
                    name: 'Sansnote',
                    ticker: 'SANS',
                    iconUrl: '/icons/sans-AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB.svg',
                    decimal_places: 8,
                    amount: BigInt(45600000000),
                    // satoshis: BigInt(222),
                    fiat: {
                        USD: 0.0456,
                    },
                },
                'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd': {
                    name: 'Dash USD',
                    ticker: 'DUSD',
                    iconUrl: '/icons/dusd-DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd.svg',
                    decimal_places: 6,
                    amount: BigInt(78900000),
                    // satoshis: BigInt(333),
                    fiat: {
                        USD: 78.9000,
                    },
                },
            })
            this.setAssetId('0')
            // this._assets = {

            // }

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

        createIdentity(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            if (_entropy.length !== 32 && _entropy.length !== 64) {
                console.error(_entropy, 'is NOT valid entropy.')

                _entropy = null
            }

            /* Set entropy. */
            _setEntropy.bind(this)(_entropy)

            /* Initialize wallet. */
            this.init()
        },

        async transfer(_receiver, _satoshis) {
            // /* Validate transaction type. */
            // if (this.asset.group === '0') {
            //     /* Send coins. */
            //     return await this.wallet.send(_receiver, _satoshis)
            // } else {
            //     /* Send tokens. */
            //     return await this.wallet.send(this.asset.token_id_hex, _receiver, _satoshis)
            // }

            const sdk = new DashPlatformSDK({ network: 'testnet' })

            const tokenid = '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz' // tDUSD

            const publicKeyId = 3 // 03 => Transfer (Critical)

            const owner = '34vkjdeUTP2z798SiXqoB6EAuobh51kXYURqVa9xkujf'
            const recipient = 'HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR'
// 'AFaVqRJCWXFZRUhuq6ZUUcWXVW8fErCN3wpEtgsBnDZm' // atlanta-degen-for-life
// '34vkjdeUTP2z798SiXqoB6EAuobh51kXYURqVa9xkujf' // NewMoneyHoney69
// HT3pUBM1Uv2mKgdPEN1gxa7A4PdsvNY89aJbdSKQb5wR // Test-1
// 8GopLQQCViyroS2gHktesGaCMe2tueXWeQ6Y9vpMFTEC // Test-2
            const amount = BigInt(_satoshis)

            /* Initialize stores. */
const Identity = useIdentityStore()

const tokenBaseTransition = await sdk.tokens.createBaseTransition(tokenid, this.id)
const stateTransition = sdk.tokens.createStateTransition(tokenBaseTransition, owner, 'transfer', { identityId: recipient, amount })

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

        setAssetId(_assetid) {
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
    },
})
