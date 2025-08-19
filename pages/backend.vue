<template>
    <main class="">
        <NavMenu />

        <section class="p-3">
            <BackendMenu />

            <pre v-html="code" class="px-3 py-5 text-amber-100 text-sm" />
        </section>
    </main>
</template>

<script setup lang="ts">
useHead({
    title: 'Back-end Developer Suite by DashSwap'
})

const code = ref(`# Back-end Integration for Python/Django
from dashswap import Swap

def my_order(request):
    # Use the Swap function from dashswap
    result = Swap.buy('DUSD')
    return HTTpResponse(result)
`)
</script>
