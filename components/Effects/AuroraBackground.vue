<template>
    <!--
        Fixed, pointer-transparent animated background used by the app shell.
        Pure CSS (GPU compositing only); disabled under prefers-reduced-motion.
        Mode-adaptive: intensity layers are driven by the CSS vars in
        assets/css/theme.css (soft wash in light mode, deep space in dark).
    -->
    <div
        class="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        style="background: var(--bg-base);"
        aria-hidden="true"
    >
        <!-- Deep-space / soft-tint wash -->
        <div
            class="absolute inset-0"
            style="background: radial-gradient(120% 90% at 15% 0%, var(--wash) 0%, transparent 58%);"
        ></div>

        <!-- Aurora blobs (damped in light mode) -->
        <div class="absolute inset-0" style="opacity: var(--aurora-opacity);">
            <div class="absolute -top-1/4 -left-1/5 h-[42rem] w-[42rem] rounded-full blur-[110px] opacity-30 bg-[radial-gradient(circle_at_30%_30%,#008de4_0%,transparent_62%)] animate-aurora-a"></div>
            <div class="absolute top-1/3 -right-1/4 h-[46rem] w-[46rem] rounded-full blur-[120px] opacity-25 bg-[radial-gradient(circle_at_60%_40%,#8b5cf6_0%,transparent_62%)] animate-aurora-b"></div>
            <div class="absolute -bottom-1/3 left-1/4 h-[38rem] w-[38rem] rounded-full blur-[120px] opacity-20 bg-[radial-gradient(circle_at_50%_50%,#f0abfc_0%,transparent_64%)] animate-aurora-c"></div>
        </div>

        <!-- Engineering grid, drifting -->
        <div
            class="absolute inset-0 animate-grid-drift"
            style="background-image:linear-gradient(var(--grid-color) 1px,transparent 1px),linear-gradient(90deg,var(--grid-color) 1px,transparent 1px);background-size:56px 56px;opacity:var(--grid-opacity);"
        ></div>

        <!-- Floating motes -->
        <div class="absolute inset-0" style="opacity: var(--mote-opacity);">
            <div class="absolute left-[12%] top-[22%] size-1.5 rounded-full bg-dash-300/70 animate-float"></div>
            <div class="absolute left-[78%] top-[16%] size-1 rounded-full bg-fuchsia-300/60 animate-float-slow"></div>
            <div class="absolute left-[30%] top-[68%] size-1.5 rounded-full bg-violet-300/50 animate-float-slow"></div>
            <div class="absolute left-[64%] top-[78%] size-1 rounded-full bg-dash-200/60 animate-float"></div>
            <div class="absolute left-[88%] top-[52%] size-1 rounded-full bg-sky-200/50 animate-float-slow"></div>
        </div>

        <!-- Vignette -->
        <div
            class="absolute inset-0"
            style="background: radial-gradient(105% 105% at 50% 45%, transparent 55%, var(--vignette-color) 100%); opacity: var(--vignette-opacity);"
        ></div>
    </div>
</template>
