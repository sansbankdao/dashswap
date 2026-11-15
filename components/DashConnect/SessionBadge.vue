<template>
    <!--
        DashConnect session widget: a Connect button when signed out, and a
        live session chip (blockie avatar + identity + logout) when signed in.
        All state comes from the dashconnect store; nothing is persisted except
        the non-secret CONNECTION_ID.
    -->
    <div class="animate-fade-up">
        <!-- Signed out -->
        <button
            v-if="!isAuthenticated"
            class="group relative w-full rounded-xl px-4 py-3 font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            @click="openLogin"
        >
            <span class="absolute inset-0 bg-brand-gradient bg-[length:200%_200%] animate-border-flow" aria-hidden="true"></span>
            <span class="absolute -inset-1 bg-dash-400/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-glow" aria-hidden="true"></span>
            <span class="relative flex items-center justify-center gap-2">
                <BoltIcon class="size-5" />
                Connect Wallet
            </span>
        </button>

        <!-- Signed in -->
        <div v-else class="relative rounded-xl bg-surface-sunken ring-1 ring-dash-400/30 p-3 flex items-center gap-3 animate-pop-in">
            <div class="absolute -inset-0.5 rounded-xl bg-dash-400/20 blur-md animate-pulse-glow" aria-hidden="true"></div>
            <img
                v-if="blockieUrl"
                :src="blockieUrl"
                class="relative size-9 rounded-lg ring-1 ring-dash-300/50"
                alt="Session avatar"
            />
            <div class="relative flex-1 min-w-0">
                <p class="text-[10px] uppercase tracking-widest text-ink3">{{ viaExtension ? 'Extension wallet' : 'DashConnect session' }}</p>
                <p class="font-mono text-xs text-ink1 truncate">{{ shortId }}</p>
            </div>
            <button
                class="relative rounded-lg p-2 text-ink3 hover:text-rose-300 hover:bg-surface-sunken transition-colors"
                :title="viaExtension ? 'Disconnect the extension wallet' : 'Sign out (wipes the in-memory session)'"
                @click="logout"
            >
                <ArrowRightStartOnRectangleIcon class="size-5" />
            </button>
        </div>
    </div>
</template>

<script setup>
/* components/DashConnect/SessionBadge.vue
 *
 * Wired to the dashconnect store only; the login modal is opened through a
 * shared Nuxt useState so any surface can trigger it.
 */

import blockies from 'ethereum-blockies-base64'
import { BoltIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'

const DashConnect = useDashConnectStore()
const Identity = useIdentityStore()

const isOpen = useState('dashconnect:login-open', () => false)

const isAuthenticated = computed(() => DashConnect.isAuthenticated)

const identityId = computed(() => DashConnect.session?.identityId ?? DashConnect.extensionIdentityId ?? '')

const viaExtension = computed(() => !DashConnect.session && !!DashConnect.extensionIdentityId)

const shortId = computed(() => {
    const id = identityId.value
    if (!id) return ''
    return `${id.slice(0, 10)}…${id.slice(-10)}`
})

const blockieUrl = computed(() => {
    const id = identityId.value
    if (!id) return ''
    try {
        return blockies(id)
    } catch (err) {
        return ''
    }
})

const openLogin = () => {
    isOpen.value = true
}

const logout = () => {
    /* Wipe the DashConnect key ring (or the extension binding), then reset
     * the legacy identity state. */
    if (viaExtension.value) {
        DashConnect.disconnectExtension()
    } else {
        DashConnect.logout()
    }
    Identity.destroy()
}
</script>
