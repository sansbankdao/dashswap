/* Import modules. */
import { defineStore } from 'pinia'
import { useSystemStore } from '@/stores/system'

import { mnemonicToEntropy } from '@ethersproject/hdnode'
import init, {
    WasmSdkBuilder,
    get_identity_balance,
    get_identity_token_balances,
    prefetch_trusted_quorums_mainnet,
    prefetch_trusted_quorums_testnet,
} from '../libs/dash/wasm_sdk.js'

import _getAssetLockProof from './identity/getAssetLockProof.ts'
import _setEntropy from './identity/setEntropy.ts'
import _transfer from './identity/transfer.ts'

import _domain from './dpns/domain.ts'
import _preorder from './dpns/preorder.ts'

/* Set constants. */
// FIXME Move these constants to System.
const FEE_AMOUNT = 1000
const MAX_INPUTS_ALLOWED = 250

// FIXME FOR DEV PURPOSES ONLY
const DASH_PRICE = 22.89
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

        /**
         * Assets
         *
         * Manages all of the client's assets.
         */
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
        // abbr(_state) {
        //     if (!_state._wallet) {
        //         return null
        //     }

        //     return _state._wallet.abbr
        // },

        /* Return wallet status. */
        // address(_state) {
        //     if (!_state._wallet) {
        //         return null
        //     }

        //     return _state._wallet.address
        // },

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
            if (_state._entropy) {
                return false
            }

            if (_state._identityid) {
                return false
            }

            return true
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
        // wallet(_state) {
        //     return _state._wallet
        // },

        /* Return WIF instance. */
        wif(_state) {
            return {
                auth: _state._pkAuthority,
                transfer: _state._pkTransfer,
            }
        },
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
            console.info('Initializing Identity...')

            /* Initialize locals. */
            let balanceCredit
            let balanceDusd
            let balanceSans
            let contractDusd
            let contractSans
            let sdk

            if (
                (typeof this._entropy === 'undefined' || this.id === this._entropy) &&
                (typeof this.id === 'undefined' || this.id === null)
            ) {
                this._entropy = 'NEW' // FIXME TEMP NEW WALLET FLAG
                throw new Error('Missing entropy AND Identity.')
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

            /* Request identity balance. */
            balanceCredit = await get_identity_balance(sdk, this.id)
// console.log('BALANCE (credits)', balanceCredit.balance)

            /* Handle network. */
            if (System.network === 'mainnet') {
                /* Set MAINNET contracts. */
                contractDusd = DUSD_CONTRACT_ID
                contractSans = SANS_CONTRACT_ID
            } else {
                /* Set TESTNET contracts. */
                contractDusd = TDUSD_CONTRACT_ID
                contractSans = TSANS_CONTRACT_ID
            }

// FOR DEVELOPMENT PURPOSES ONLY
            /* Request DUSD balance. */
            balanceDusd = await get_identity_token_balances(sdk, this.id, [contractDusd])
                .catch(err => {
                    console.error(err)
                    console.error('DUSD NOT FOUND!!')
                })

            /* Request SANS balance. */
            balanceSans = await get_identity_token_balances(sdk, this.id, [contractSans])
                .catch(err => {
                    console.error(err)
                    console.error('SANS NOT FOUND!!')
                })

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
                        amount: BigInt(balanceSans[0]?.balance || 0),
                        // satoshis: BigInt(222), // IS THIS DEPRECATED??
                        fiat: {
                            USD: (((balanceSans[0]?.balance || 0)/10**8) * SANS_PRICE).toFixed(4),
                        },
                    },
                    'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd': {
                        name: 'Dash USD',
                        ticker: 'DUSD',
                        iconUrl: '/icons/dusd-DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd.svg',
                        decimal_places: 6,
                        amount: BigInt(balanceDusd[0]?.balance || 0),
                        // satoshis: BigInt(333), // IS THIS DEPRECATED??
                        fiat: {
                            USD: (((balanceDusd[0]?.balance || 0)/10**6) * DUSD_PRICE).toFixed(4),
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
                        amount: BigInt(balanceSans[0]?.balance || 0),
                        // satoshis: BigInt(222), // IS THIS DEPRECATED??
                        fiat: {
                            USD: (((balanceSans[0]?.balance || 0)/10**8) * SANS_PRICE).toFixed(4),
                        },
                    },
                    '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz': {
                        name: '[TEST] Dash USD',
                        ticker: 'tDUSD',
                        iconUrl: '/icons/dusd-DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd.svg',
                        decimal_places: 6,
                        amount: BigInt(balanceDusd[0]?.balance || 0),
                        // satoshis: BigInt(333), // IS THIS DEPRECATED??
                        fiat: {
                            USD: (((balanceDusd[0]?.balance || 0)/10**6) * DUSD_PRICE).toFixed(4),
                        },
                    },
                })
            }

// TODO Save last tab.
            this.setAsset('0')
        },

        async createIdentity() {
            /* Request asset lock proof. */
            const proof = _getAssetLockProof.bind(this)()

            return proof
        },

        async preorder(_receiver, _satoshis) {
            /* Broadcast to receivers. */
            return _preorder.bind(this)(_receiver, _satoshis)
        },

        async domain(_receiver, _satoshis) {
            /* Broadcast to receivers. */
            return _domain.bind(this)(_receiver, _satoshis)
        },

        async transfer(_receiver, _satoshis) {
            /* Broadcast to receivers. */
            return _transfer.bind(this)(_receiver, _satoshis)
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
console.log('SETTING MNEMONIC', _mnemonic)
            try {
                /* Derive entropy. */
                entropy = mnemonicToEntropy(_mnemonic)
            } catch (err) {
                /* Set error message. */
                error = err.message
            }
console.log('SETTING ENTROPY', entropy)
            /* Validate error. */
            if (error) {
                return error
            }

            /* Set entropy. */
            this._entropy = entropy

            /* Create wallet. */
            // this.createWallet(entropy)

            /* Return entropy. */
            // return this.wallet
            return entropy
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

        generateALP(_chain_locked_height, _txid) {
            /* Broadcast to receivers. */
            return _getAssetLockProof.bind(this)(_chain_locked_height, _txid)
        },
    },
})
