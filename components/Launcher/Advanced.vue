<template>
    <main class="mt-10 border-t border-gray-200 pt-10">
        <h2 class="text-2xl font-medium text-slate-300 tracking-wider">
            Token Advanced Details
        </h2>

        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
                <label for="first-name" class="block text-lg font-medium text-slate-200">
                    Maximum decimals
                </label>

                <div class="mt-2">
                    <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <!-- <div>
                <label for="last-name" class="block text-sm/6 font-medium text-gray-700">Last name</label>
                <div class="mt-2">
                    <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        autocomplete="family-name"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div> -->
        </div>

        <fieldset class="mt-6 border-b border-t border-gray-200 dark:border-white/10">
            <legend class="sr-only">
                Token Advanced Details
            </legend>

            <div class="divide-y divide-gray-200 dark:divide-white/10">
                <div class="relative flex gap-3 pb-4 pt-3.5">
                    <div class="min-w-0 flex-1 text-sm/6">
                        <label for="comments" class="text-lg font-medium text-slate-700 dark:text-white">
                            Start paused
                        </label>

                        <p id="comments-description" class="text-slate-500 dark:text-slate-200">
                            Allows a creator to manually control when &amp; how the token becomes tradeable.
                        </p>
                    </div>

                    <div class="flex h-6 shrink-0 items-center">
                        <div class="group grid size-4 grid-cols-1">
                            <input
                                id="comments"
                                type="checkbox"
                                name="comments"
                                checked
                                aria-describedby="comments-description"
                                class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto"
                            />
                            <svg
                                viewBox="0 0 14 14"
                                fill="none"
                                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                            >
                                <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:checked]:opacity-100" />
                                <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:indeterminate]:opacity-100" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="relative flex gap-3 pb-4 pt-3.5">
                    <div class="min-w-0 flex-1 text-sm/6">
                        <label for="candidates" class="text-lg font-medium text-slate-700 dark:text-white">
                            Keep history
                        </label>

                        <p id="candidates-description" class="text-slate-500 dark:text-slate-200">
                            Will record ALL token activity immutably to the blockchain.
                        </p>
                    </div>

                    <div class="flex h-6 shrink-0 items-center">
                        <div class="group grid size-4 grid-cols-1">
                            <input
                                id="candidates"
                                type="checkbox"
                                name="candidates"
                                aria-describedby="candidates-description"
                                class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto"
                            />
                            <svg
                                viewBox="0 0 14 14"
                                fill="none"
                                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                            >
                                <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:checked]:opacity-100" />
                                <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:indeterminate]:opacity-100" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="relative flex gap-3 pb-4 pt-3.5">
                    <div class="min-w-0 flex-1 text-sm/6">
                        <label for="offers" class="text-lg font-medium text-slate-700 dark:text-white">
                            Name should be capitalized
                        </label>

                        <p id="offers-description" class="text-slate-500 dark:text-slate-200">
                            Indicates to front-end builders how to display your token name.
                        </p>
                    </div>

                    <div class="flex h-6 shrink-0 items-center">
                        <div class="group grid size-4 grid-cols-1">
                            <input
                                id="offers"
                                type="checkbox"
                                name="offers"
                                aria-describedby="offers-description"
                                class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:focus-visible:outline-indigo-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10 forced-colors:appearance-auto"
                            />
                            <svg
                                viewBox="0 0 14 14"
                                fill="none"
                                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                            >
                                <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:checked]:opacity-100" />
                                <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-[:indeterminate]:opacity-100" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>


    </main>
</template>
