/* Import modules. */
import { defineStore } from 'pinia'

/**
 * Session Store
 */
export const useSessionStore = defineStore('session', {
    state: () => ({
            /* Initialize session. */
            _session: null,
    }),

    getters: {
        session(_state) {
            return _state._session || null
        },

        sessionid(_state) {
            return _state._session?.sessionid || null
        },

    },

    actions: {
        async list() {
            /* Initialize locals. */
            let response
            let sessions

            const uuid = 'fc261002-4aec-4d91-9b37-5f69c72d30d3'
            const headers = {
                'content-type': 'application/json',
                'Authorization': `Bearer ${uuid}`
            }

            /* Request new session. */
            response = await $fetch('https://sansbank.org/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query: `query Session {
                      session {
                        totalCount
                        edges {
                          node {
                            sessionid
                            fid
                            account
                            nonce
                            hasAuth
                            error
                            expiresAt
                            createdAt
                          }
                        }
                        pageInfo {
                          hasNextPage
                          hasPreviousPage
                          startCursor
                          endCursor
                        }
                      }
                    }`
                })
            }).catch(err => console.error(err))
// console.log('SESSIONS (response):', response)

            /* Validate response. */
            if (typeof response !== 'undefined' && response !== null) {
                sessions = response?.data?.session
            }

            /* Return session. */
            return sessions
        },

        async get(_sessionid) {
            /* Initialize locals. */
            let response
            let session

            const uuid = 'fc261002-4aec-4d91-9b37-5f69c72d30d3'
            const headers = {
                'content-type': 'application/json',
                'Authorization': `Bearer ${uuid}`
            }

            /* Request new session. */
            response = await $fetch('https://sansbank.org/graphql', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query: `query Session {
                      session(sessionid: "${_sessionid}") {
                        totalCount
                        edges {
                          node {
                            sessionid
                            fid
                            account
                            nonce
                            hasAuth
                            error
                            expiresAt
                            createdAt
                          }
                        }
                        pageInfo {
                          hasNextPage
                          hasPreviousPage
                          startCursor
                          endCursor
                        }
                      }
                    }`
                })
            }).catch(err => console.error(err))
// console.log('SESSION (response):', response)

            /* Validate response. */
            if (typeof response !== 'undefined' && response !== null) {
                session = response?.data?.session
            }

            /* Return session. */
            return session
        },

        delete() {
            /* Set session. */
            this._set(null)
        },

        save(_session) {
            /* Set session. */
            this._set(_session)
        },

        /**
         * Set Session
         *
         * @param {Object} _session Save session details.
         */
        _set (_session) {
            /* Set session. */
            this._session = _session
            // console.log('SET SESSION', this._session)
        },

    },
})
