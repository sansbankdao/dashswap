<template>
    <div class="flex flex-col gap-5 items-center text-center sm:items-start sm:text-left animate-fade-up">

        <NuxtLink :to="connected ? '/id' : '/profile'" class="group flex flex-col sm:flex-row gap-4 sm:items-center">
            <span class="relative">
                <span class="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-70" aria-hidden="true"></span>
                <!-- Guest silhouette (replaces the old emoji-style profile photo) -->
                <span
                    class="relative flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300 group-hover:scale-[1.03]"
                    :class="connected ? 'bg-brand-gradient ring-2 ring-dash-300/60' : 'bg-surface ring-2 ring-white/10'"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="size-10" :class="connected ? 'text-white/90' : 'text-ink3'" aria-hidden="true">
                        <path d="M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 11c4.56 0 8.25 1.94 8.25 5.25v.25a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75v-.25C3.75 15.94 7.44 14 12 14Z"/>
                    </svg>
                    <span
                        v-if="connected"
                        class="absolute -bottom-1 -right-1 flex items-center justify-center size-5 rounded-full bg-emerald-500 ring-2 ring-surface"
                        title="Connected"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-3 text-white" aria-hidden="true">
                            <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                </span>
            </span>

            <div>
                <h1 class="text-xl font-extrabold mb-0.5 inline-block relative bg-text-gradient bg-clip-text text-transparent">
                    {{ connected ? 'My Identity' : profile.name }}
                </h1>

                <p
                    v-if="connected"
                    class="text-xs mb-2 font-medium text-emerald-300"
                >
                    Connected — {{ viaExtension ? 'extension wallet' : 'DashConnect' }}
                </p>
                <p
                    v-else
                    class="text-xs mb-2 text-dash-300 font-medium group-hover:text-amber-300 transition-colors"
                >
                    click here to CONNECT
                </p>

                <p v-if="connected" class="font-mono text-[11px] text-ink3 truncate max-w-[11rem]" :title="identityId">
                    {{ identityShortId }}
                </p>

                <p class="flex items-center justify-center sm:justify-start text-sm text-ink2">
                    <svg class="-mt-0.5 inline mr-2"fill=none height=14 stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 viewBox="0 0 24 24"width=14 xmlns=http://www.w3.org/2000/svg><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx=12 cy=10 r=3></circle></svg>
                    {{profile.location}}
                </p>
            </div>
        </NuxtLink>

        <section class="text-base leading-relaxed">
            <h2 class="text-xl font-bold tracking-wider text-ink1">
                Welcome Guest
            </h2>

            <p class="text-ink2 mt-1">
                Let's get you signed-in and have your assets loaded on to your dashboard.
            </p>
        </section>

        <DashConnectSessionBadge />
    </div>
</template>

<script setup lang="ts">
// import { Picture } from 'astro:assets';
// import ProfilePicture from '../assets/profile.png';

const Profile = useProfileStore()
const DashConnect = useDashConnectStore()

const profile = ref({
    name: 'Guest User',
    title: 'click here to CONNECT',
    location: 'no wallet connected',
})

/* Connected state (either session kind) — the card flips from the
 * "connect here" prompt to a live identity card linking to /id. */
const identityId = computed(() =>
    DashConnect.session?.identityId ?? DashConnect.extensionIdentityId ?? null)

const connected = computed(() => !!identityId.value)

const viaExtension = computed(() =>
    !DashConnect.session && !!DashConnect.extensionIdentityId)

const identityShortId = computed(() => {
    const id = identityId.value || ''
    return id ? `${id.slice(0, 8)}…${id.slice(-4)}` : ''
})

</script>
