<template>
    <main class="">
        <NavMenu />

        <div class="flex-grow overflow-y-auto bg-black">
            <GalleryDetail
                :name="name"
                :imageSrc="imageSrc"
            />
        </div>
    </main>
</template>

<script setup lang="ts">

const route = useRoute()
console.log('ROUTE', route)

const path = ref()
const name = ref()
const imageSrc = ref()

const init = async () => {
    path.value = route.path.slice(9)

    switch(path.value) {
    case '3oTHkj8nqn82QkZRHkmUmNBX696nzE1rg1fwPRpemEdz':
        name.value = 'Dash USD'
        imageSrc.value = 'https://dashswap.xyz/icon.svg'
        break
    case 'A36eJF2kyYXwxCtJGsgbR3CTAscUFaNxZN19UqUfM1kw':
        name.value = 'Sansnote'
        imageSrc.value = 'https://sansbank.org/icon.svg'
        break
    default:
        name.value = 'Unknown'
        imageSrc.value = ''
    }
console.log('FINISHED', path.value, name.value)
}

onMounted(() => {
    // init()
    setTimeout(init, 5000)
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>
