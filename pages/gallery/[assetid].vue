<template>
    <main class="">
        <NavMenu />

        <div class="flex-grow overflow-y-auto bg-black">
            <GalleryDetail />
        </div>
    </main>
</template>

<script setup lang="ts">

const route = useRoute()
console.log('ROUTE', route)

const path = ref()

const init = async () => {
    path.value = route.path.slice(9)
}

onMounted(() => {
    // init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
