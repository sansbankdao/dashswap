<template>
    <div class="flex flex-col gap-6 items-center text-center sm:items-start sm:text-left">

        <NuxtLink to="/connect" class="group flex flex-col sm:flex-row gap-4 sm:items-center">
            <img
                src="@/assets/profile.png"
                class="w-24 h-24 rounded-xl object-cover border-2 border-sky-300 mx-auto sm:mx-0 group-hover:border-amber-300"
                alt="Profile Photo"
            />

            <div>

                <h1 class="text-2xl font-extrabold mb-1 inline-block relative text-slate-200">
                    {{profile.name}}
                </h1>

                <p class="text-sm mb-2 text-sky-300 font-medium group-hover:text-amber-300">
                    click here to CONNECT
                </p>

                <p class="flex items-center justify-center sm:justify-start text-sm text-slate-200">
                    <svg class="-mt-0.5 inline mr-2"fill=none height=14 stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 viewBox="0 0 24 24"width=14 xmlns=http://www.w3.org/2000/svg><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx=12 cy=10 r=3></circle></svg>
                    {{profile.location}}
                </p>

            </div>
        </NuxtLink>

        <section class="text-base leading-relaxed mt-4 text-slate-200">
            <h2 class="text-2xl font-bold tracking-wider">
                Welcome Guest
            </h2>

            <p>
                Let's get you signed-in and have your assets loaded on to your dashboard.
            </p>
        </section>

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
