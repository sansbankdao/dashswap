/* Import modules. */
import { defineStore } from 'pinia'

/**
 * Rainmaker Store
 */
export const useRainmakerStore = defineStore('rainmaker', {
    state: () => ({
        _campaign: null,

        _profiles: null,
    }),

    getters: {
        campaign(_state) {
            // FIXME FOR DEV PURPOSES ONLY
            return {
                id: 'eba8c2e7-38b2-47cc-bbc5-fa37cfd9adc2',
                title: 'Platform Validator Airdrop',
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

        async runBootstrap() {
            console.log('Running bootstrap campaign...')

            /* Initialize locals. */
            let response
            let validator

            const authid = '3a4a7fdb-dc73-4737-85c6-262cb18bf242'

            response = await $fetch('https://sansbank.org/graphql', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    query: `mutation ManageValidator {
                        manageValidator(authid: "${authid}", action: "getNext") {
                        platformid
                        status
                        createdAt
                        }
                    }`
                })
            }).catch(err => console.error(err))
// console.log('VALIDATOR (response):', response)

            /* Validate response. */
            if (typeof response !== 'undefined' && response !== null) {
                validator = response?.data?.manageValidator[0]
            }
console.log('VALIDATOR', validator)

            /* Return validator. */
            return validator
        },

    },
})
