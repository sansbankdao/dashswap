<template>
    <!--
        Swap status badge — the full FRONTEND-HANDOFF §5 vocabulary, rendered
        forward-compatibly (unknown statuses get the neutral chip).
    -->
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1"
        :class="styles[status] || styles.unknown"
    >
        <span
            v-if="pulsing"
            class="size-1.5 rounded-full animate-pulse"
            :class="dot[status] || 'bg-slate-400'"
            aria-hidden="true"
        ></span>
        {{ status }}
    </span>
</template>

<script setup>
/* components/Swap/StatusBadge.vue — swap status chip. */

const props = defineProps({
    status: {
        type: String,
        required: true,
    },
})

const styles = {
    pending: 'bg-amber-400/10 text-amber-300 ring-amber-400/40',
    detected: 'bg-sky-400/10 text-sky-300 ring-sky-400/40',
    confirmed: 'bg-indigo-400/10 text-indigo-300 ring-indigo-400/40',
    settling: 'bg-violet-400/10 text-violet-300 ring-violet-400/40',
    settled: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/40',
    failed: 'bg-rose-400/10 text-rose-300 ring-rose-400/40',
    refunded: 'bg-slate-400/10 text-slate-300 ring-slate-400/40',
    unknown: 'bg-surface-sunken text-ink3 ring-line',
}

const pulsing = computed(() => ['pending', 'settling'].includes(props.status))

const dot = {
    pending: 'bg-amber-400',
    settling: 'bg-violet-400',
}
</script>
