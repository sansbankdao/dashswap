<template>
    <!--
        Glass surface card with a flowing gradient border and hover lift.
        Purely presentational; the slot carries the content.
    -->
    <div class="relative group/card">
        <div
            class="absolute -inset-px rounded-2xl opacity-60 group-hover/card:opacity-100 transition-opacity duration-300 animate-border-flow bg-brand-gradient bg-[length:200%_200%]"
            aria-hidden="true"
        ></div>
        <div
            class="absolute -inset-3 rounded-3xl bg-dash-500/10 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 animate-pulse-glow"
            aria-hidden="true"
        ></div>
        <div
            class="relative rounded-2xl bg-glass-surface shadow-glass ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-300 group-hover/card:-translate-y-0.5"
        >
            <slot />
        </div>
    </div>
</template>
