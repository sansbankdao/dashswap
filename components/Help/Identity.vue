<template>
    <main class="p-3">
        <h1 class="text-slate-800 text-7xl font-bold">
            Dash ID Assistant
        </h1>

        <p class="text-xl xl:text-2xl text-zinc-300 text-pretty">
            A collection of useful tools for everyday use.
        </p>

        <input
            v-model="query"
            id="platform-id"
            type="text"
            placeholder="Search for a Dash ID"
            class="px-5 py-3 text-3xl text-slate-900 bg-sky-50 border rounded-xl shadow"
        />

        <button @click="search" id="btn-find-id" class="w-full sm:w-fit flex text-2xl font-bold tracking-wider bg-amber-200">
            Find
        </button>
    </main>
</template>

<script setup lang="ts">
/* Import modules. */
import moment from 'moment'

const query = ref()

const search = async () => {
    console.log('SEARCH for ID', query.value)
}

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
