/* Import modules. */
import { defineStore } from 'pinia'

import { DashPlatformSDK } from 'dash-platform-sdk'
import {
    AssetLockProofWASM,
    OutPointWASM,
    PrivateKeyWASM,
} from 'pshenmic-dpp'

import _collectible from './assets/collectible.ts'

/**
 * Launcher Store
 */
export const useLauncherStore = defineStore('launcher', {
    state: () => ({
        _campaign: null,

        _profiles: null,
    }),

    getters: {
        campaign(_state) {
            // FIXME FOR DEV PURPOSES ONLY
            return {
                id: 'eba8c2e7-38b2-47cc-bbc5-fa37cfd9adc2',
                title: '1st $STUDIO Stakehouse Airdrop',
                createdAt: 1234567890,
            }
        },

        network(_state) {
            // FIXME FOR DEV PURPOSES ONLY
            return 'telegram'
        },

    },

    actions: {
        init() {
            return {
                id: 'my-test-campaign',
            }
        },

        async test(_receiver, _satoshis) {
console.log('RUNNING LAUNCHER TEST...')

            /* Broadcast to receivers. */
            return _collectible.bind(this)(_receiver, _satoshis)
        },
    },
})
