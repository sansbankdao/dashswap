<template>
    <!--
        Section heading with gradient text and an animated underline sweep.
    -->
    <div class="inline-flex flex-col gap-2 animate-fade-up">
        <h2 class="text-xl sm:text-2xl font-bold tracking-wide bg-text-gradient bg-clip-text text-transparent">
            <slot />
        </h2>
        <span class="relative h-0.5 w-full overflow-hidden rounded-full bg-white/10">
            <span class="absolute inset-y-0 left-0 w-1/3 rounded-full bg-brand-gradient animate-shimmer bg-[length:200%_100%]"></span>
        </span>
    </div>
</template>
