/* Import modules. */
import { defineStore } from 'pinia'
// import { mnemonicToEntropy } from '@nexajs/hdnode'
// import { sendCoins } from '@nexajs/purse'

import _setEntropy from './identity/setEntropy.ts'

/* Set constants. */
// FIXME Move these constants to System.
const FEE_AMOUNT = 1000
const MAX_INPUTS_ALLOWED = 250

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
         *     title     : `My Studio Wallet`,
         *     entropy   : 0x0000000000000000000000000000000000000000000000000000000000000000,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         *   {
         *     id        : 'f2457985-4b92-4025-be8d-5f11a5fc4077',
         *     type      : 'ledger',
         *     title     : `My Ledger Wallet`,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         * ]
         */
        _keychain: null,

        /**
         * Wallet
         *
         * Currently active wallet object.
         */
        _wallet: null,
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
            if (!_state._wallet) {
                return true
            }

            return _state._wallet.isLoading
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
         * Setup the wallet store.
         *   1. Retrieve the saved entropy.
         *   2. Initialize a Wallet instance.
         *   3. Load assets.
         */
        async init() {
            console.info('Initializing identity...')

            // if (this._entropy === null) {
            //     this._wallet = 'NEW' // FIXME TEMP NEW WALLET FLAG
            //     // throw new Error('Missing wallet entropy.')
            //     return console.error('Missing wallet entropy.')
            // }

            this.setAssetId('0')
            this.setAssets({
                '0': {
                    ticker: 'DASH',
                    iconUrl: '/icons/dash.svg'
                },
                'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB': {
                    ticker: 'SANS',
                    iconUrl: '/icons/sans-AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB.svg'
                },
            })
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
            /* Validate transaction type. */
            if (this.asset.group === '0') {
                /* Send coins. */
                return await this.wallet.send(_receiver, _satoshis)
            } else {
                /* Send tokens. */
                return await this.wallet.send(this.asset.token_id_hex, _receiver, _satoshis)
            }
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
