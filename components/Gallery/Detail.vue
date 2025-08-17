<template>
    <main class="p-3 flex flex-col gap-4">
        <h1 class="text-sky-300 text-4xl font-bold">
            Detail View
        </h1>

        <h3 class="text-sky-400 text-3xl">
            ASSET ID: {{assetid}}
        </h3>
    </main>
</template>

<script setup lang="ts">

const route = useRoute()
console.log('ROUTE', route)

const assetid = ref()

const init = async () => {
    assetid.value = route.path.slice(9)
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
