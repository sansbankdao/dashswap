<template>
    <!--
        Fixed, pointer-transparent animated background used by the app shell.
        Pure CSS (GPU compositing only); disabled under prefers-reduced-motion.
    -->
    <div
        class="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#05060f]"
        aria-hidden="true"
    >
        <!-- Deep-space base wash -->
        <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,#131a3a_0%,#05060f_58%)]"></div>

        <!-- Aurora blobs -->
        <div class="absolute -top-1/4 -left-1/5 h-[42rem] w-[42rem] rounded-full blur-[110px] opacity-30 bg-[radial-gradient(circle_at_30%_30%,#008de4_0%,transparent_62%)] animate-aurora-a"></div>
        <div class="absolute top-1/3 -right-1/4 h-[46rem] w-[46rem] rounded-full blur-[120px] opacity-25 bg-[radial-gradient(circle_at_60%_40%,#8b5cf6_0%,transparent_62%)] animate-aurora-b"></div>
        <div class="absolute -bottom-1/3 left-1/4 h-[38rem] w-[38rem] rounded-full blur-[120px] opacity-20 bg-[radial-gradient(circle_at_50%_50%,#f0abfc_0%,transparent_64%)] animate-aurora-c"></div>

        <!-- Engineering grid, drifting -->
        <div
            class="absolute inset-0 opacity-[0.13] animate-grid-drift"
            style="background-image:linear-gradient(rgba(124,196,255,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(124,196,255,0.16) 1px,transparent 1px);background-size:56px 56px;"
        ></div>

        <!-- Floating motes -->
        <div class="absolute left-[12%] top-[22%] size-1.5 rounded-full bg-dash-300/70 animate-float"></div>
        <div class="absolute left-[78%] top-[16%] size-1 rounded-full bg-fuchsia-300/60 animate-float-slow"></div>
        <div class="absolute left-[30%] top-[68%] size-1.5 rounded-full bg-violet-300/50 animate-float-slow"></div>
        <div class="absolute left-[64%] top-[78%] size-1 rounded-full bg-dash-200/60 animate-float"></div>
        <div class="absolute left-[88%] top-[52%] size-1 rounded-full bg-sky-200/50 animate-float-slow"></div>

        <!-- Vignette -->
        <div class="absolute inset-0 bg-[radial-gradient(105%_105%_at_50%_45%,transparent_55%,rgba(2,3,10,0.85)_100%)]"></div>
    </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
    [class*='animate-'] {
        animation: none !important;
    }
}
</style>
