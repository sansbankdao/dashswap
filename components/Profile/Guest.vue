<template>
    <div class="flex flex-col gap-5 items-center text-center sm:items-start sm:text-left animate-fade-up">

        <NuxtLink to="/profile" class="group flex flex-col sm:flex-row gap-4 sm:items-center">
            <span class="relative">
                <span class="absolute -inset-1 rounded-2xl bg-brand-gradient opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-70" aria-hidden="true"></span>
                <img
                    src="@/assets/profile.png"
                    class="relative w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 transition-all duration-300 group-hover:ring-dash-300/60 group-hover:scale-[1.03]"
                    alt="Profile Photo"
                />
            </span>

            <div>
                <h1 class="text-xl font-extrabold mb-0.5 inline-block relative bg-text-gradient bg-clip-text text-transparent">
                    {{profile.name}}
                </h1>

                <p class="text-xs mb-2 text-dash-300 font-medium group-hover:text-amber-300 transition-colors">
                    click here to CONNECT
                </p>

                <p class="flex items-center justify-center sm:justify-start text-sm text-slate-300">
                    <svg class="-mt-0.5 inline mr-2"fill=none height=14 stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 viewBox="0 0 24 24"width=14 xmlns=http://www.w3.org/2000/svg><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx=12 cy=10 r=3></circle></svg>
                    {{profile.location}}
                </p>
            </div>
        </NuxtLink>

        <section class="text-base leading-relaxed">
            <h2 class="text-xl font-bold tracking-wider text-slate-100">
                Welcome Guest
            </h2>

            <p class="text-slate-300 mt-1">
                Let's get you signed-in and have your assets loaded on to your dashboard.
            </p>
        </section>

        <DashConnectSessionBadge />
    </div>
</template>

<script setup lang="ts">
// import { Picture } from 'astro:assets';
// import ProfilePicture from '../assets/profile.png';

const profile = ref({
    name: 'Guest User',
    title: 'click here to CONNECT',
    location: 'no wallet connected',
})

</script>
