<template>
    <!--
        DashSwap app shell — "Evolution" theme.
        Animated aurora background, glass panels, sticky brand header.
        The <slot /> remains the single dynamic content mount point.
    -->
    <div class="relative min-h-[100vh] flex flex-col">
        <AuroraBackground />

        <!-- Brand header -->
        <header class="sticky top-0 z-30 border-b border-line bg-chrome backdrop-blur-xl">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
                <NuxtLink to="/" class="group flex items-center gap-3">
                    <span class="relative">
                        <span class="absolute -inset-1.5 rounded-xl bg-dash-500/30 blur-md group-hover:animate-pulse-glow" aria-hidden="true"></span>
                        <img src="/icon.svg" class="relative size-9 transition-transform duration-300 group-hover:scale-110" alt="DashSwap" />
                    </span>
                    <span class="leading-tight">
                        <span class="block text-lg font-extrabold tracking-tight bg-text-gradient bg-clip-text text-transparent">
                            DashSwap
                        </span>
                        <span class="block text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            Buy · Sell · Collect
                        </span>
                    </span>
                </NuxtLink>

                <span class="ml-auto hidden sm:flex items-center gap-2 rounded-full bg-surface-sunken ring-1 ring-line px-3 py-1.5 text-xs text-ink2">
                    <span class="size-1.5 rounded-full bg-dash-300 animate-pulse" aria-hidden="true"></span>
                    Dash Platform v2.0 · by <a href="https://sansbank.org/bootstrap" target="_blank" class="text-dash-300 hover:text-dash-200 transition-colors">Sansbank</a>
                </span>

                <ThemeToggle class="ml-1" />
            </div>
        </header>

        <!-- Content columns -->
        <main class="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-5 items-start">
            <!-- Side rail: identity + network + quick nav -->
            <aside class="flex flex-col gap-4 lg:sticky lg:top-20 animate-fade-up">
                <GlowCard>
                    <div class="p-5">
                        <ProfileGuest />
                    </div>
                </GlowCard>

                <GlowCard>
                    <div class="p-5 flex flex-col gap-5">
                        <SessionBadge />
                        <NetworkManager />
                    </div>
                </GlowCard>

                <GlowCard>
                    <div class="p-4">
                        <QuickNav />
                    </div>
                </GlowCard>
            </aside>

            <!-- Dynamic content -->
            <section class="min-w-0 animate-fade-up" style="animation-delay: 90ms;">
                <GlowCard>
                    <div class="rounded-2xl overflow-hidden">
<!-- Dynamic Content SLOT Begins Here-->
                        <slot />
<!-- Dynamic Content SLOT Ends Here-->
                    </div>
                </GlowCard>
            </section>
        </main>

        <!-- Footer -->
        <footer class="relative z-10 border-t border-line bg-chrome backdrop-blur-xl">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex justify-center">
                <span class="text-ink2 text-center text-sm tracking-wider">
                    ⟡˙⋆ DashSwap was built with
                    <svg class="inline size-5 text-rose-400 animate-float" data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"></path>
                    </svg>
                    by <a href="https://sansbank.org/bootstrap" target="_blank" title="Sansbank Bootstrap" class="bg-text-gradient bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity">
                        Sansbank
                    </a>
                    <span class="hidden sm:inline">for the DASH Evolution</span> ⋆˙⟡
                </span>
            </div>
        </footer>

        <!-- DashConnect login (teleported; available on every page) -->
        <DashConnectLoginModal />

        <!-- AI support chat (bottom-right) — wired to /v1/support/chat -->
        <SupportChat />
    </div>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

/* Initialize stores. */
import { useIdentityStore } from '@/stores/identity'
import { useProfileStore } from '@/stores/profile'
import { useSystemStore } from '@/stores/system'
import { useDashConnectStore } from '@/stores/dashconnect'
const Identity = useIdentityStore()
const Profile = useProfileStore()
const System = useSystemStore()
const DashConnect = useDashConnectStore()

const init = async () => {
    console.log('init...')

    /* Initialize system. */
    System.init()

    /* Initialize DashConnect (configuration + CONNECTION_ID). */
    DashConnect.init()

    /* Initialize identity. */
    Identity.init()
}

onBeforeMount(() => {
    // TODO Move this block to @nexajs/app
    // NOTE: The Identity store is DELIBERATELY NOT persisted. Its state
    //       includes wallet entropy and private keys (legacy path) and App
    //       Connect session keys — secrets must never reach localStorage.
    //       Non-secret identity data is rebuilt by Identity.init() on mount.
    try {
        Profile.$state = JSON.parse(localStorage.getItem('profile'), (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, value.length - 1))
            }
            return value
        })

        System.$state = JSON.parse(localStorage.getItem('system'), (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, value.length - 1))
            }
            return value
        })

        // add additional states here...
    } catch (err) {
        console.error(err)
    }
})

// TODO Move this block to @nexajs/app
// NOTE: Identity is excluded here for the same reason as above — its state
//       carries secrets, and only secrets-free stores are persisted.
watch([Profile.$state, System.$state], (_state) => {
    localStorage.setItem('profile',
        JSON.stringify(_state[0], (key, value) =>
            typeof value === 'bigint' ? value.toString() + 'n' : value
        )
    )

    localStorage.setItem('system',
        JSON.stringify(_state[1], (key, value) =>
            typeof value === 'bigint' ? value.toString() + 'n' : value
        )
    )

    // watch additional states here...
})

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
