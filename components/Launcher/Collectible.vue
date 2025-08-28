<template>
    <main class="py-6">
        <section class="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <!-- <h2 class="text-base/7 font-semibold text-gray-900 dark:text-green-100">
                Profile
            </h2> -->

            <p class="mt-1 text-base/6 text-green-700 dark:text-green-100">
                This information will be displayed publicly so be careful what you share.
            </p>

            <div class="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <!-- <div class="sm:col-span-4">
                    <label for="username" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">
                        Username
                    </label>

                    <div class="mt-2">
                        <div
                            class="flex items-center rounded-md bg-green-50 pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600 dark:bg-green-50/5 dark:outline-white/10 dark:focus-within:outline-sky-500"
                        >
                            <div class="shrink-0 select-none text-base text-gray-500 sm:text-sm/6 dark:text-gray-400">workcation.com/</div>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                class="block min-w-0 grow bg-green-50 py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 dark:bg-transparent dark:text-green-100 dark:placeholder:text-gray-500"
                                placeholder="janesmith"
                            />
                        </div>
                    </div>
                </div> -->

                <div class="col-span-full">
                    <label for="about" class="block text-lg/6 font-medium text-gray-900 dark:text-green-100">
                        Describe Your Collectible
                    </label>

                    <div class="mt-2">
                        <textarea
                            rows="2"
                            class="block w-full rounded-md bg-green-50 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 dark:bg-green-50/5 dark:text-green-100 dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                        />
                    </div>

                    <p class="mt-3 text-sm/6 text-green-800 dark:text-green-200">
                        Write a few sentences about what you're making.
                    </p>
                </div>

                <div class="col-span-full">
                    <label for="photo" class="block text-lg/6 font-medium text-gray-900 dark:text-green-100">
                        Creator Photo
                    </label>

                    <div class="mt-2 flex items-center gap-x-3">
                        <UserCircleIcon class="size-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                        <button
                            type="button"
                            class="rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-green-50/10 dark:text-green-100 dark:shadow-none dark:ring-white/5 dark:hover:bg-green-50/20"
                        >
                            Change
                        </button>
                    </div>
                </div>

                <div class="col-span-full">
                    <label for="cover-photo" class="block text-lg/6 font-medium text-gray-900 dark:text-green-100">
                        Cover Photo
                    </label>

                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
                        <div class="text-center">
                            <PhotoIcon class="mx-auto size-12 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                            <div class="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
                                <label
                                    for="file-upload"
                                    class="relative cursor-pointer rounded-md bg-transparent font-semibold text-sky-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-600 hover:text-sky-500 dark:text-sky-400 dark:focus-within:outline-sky-500 dark:hover:text-sky-300"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>

                            <p class="text-xs/5 text-gray-600 dark:text-gray-400">
                                PNG, JPG, GIF up to 10MB
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-gray-900/10 pt-4 pb-12 dark:border-white/10">
            <h2 class="text-lg/7 font-semibold text-gray-900 dark:text-green-100">
                Creator Information
            </h2>

            <p class="mt-1 text-sm/6 text-green-700 dark:text-green-200">
                Use a permanent email address where you can receive licensing requests.
            </p>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <label for="first-name" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">
                        First name
                    </label>

                    <div class="mt-2">
                        <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autocomplete="given-name"
                            class="block w-full rounded-md bg-green-50 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 dark:bg-green-50/5 dark:text-green-100 dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                        />
                    </div>
                </div>

                <div class="sm:col-span-3">
                    <label for="last-name" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">
                        Last name
                    </label>

                    <div class="mt-2">
                        <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autocomplete="family-name"
                            class="block w-full rounded-md bg-green-50 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 dark:bg-green-50/5 dark:text-green-100 dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                        />
                    </div>
                </div>

                <div class="sm:col-span-4">
                    <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">
                        Email address
                    </label>

                    <div class="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            class="block w-full rounded-md bg-green-50 px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 dark:bg-green-50/5 dark:text-green-100 dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                        />
                    </div>
                </div>

                <div class="sm:col-span-3">
                    <label for="country" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">
                        Country
                    </label>

                    <div class="mt-2 grid grid-cols-1">
                        <select
                            id="country"
                            name="country"
                            autocomplete="country-name"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-green-50 py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 dark:bg-green-50/5 dark:text-green-100 dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-sky-500"
                        >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                        </select>
                        <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-gray-900/10 pt-4 pb-12 dark:border-white/10">
            <h2 class="text-lg/7 font-semibold text-gray-900 dark:text-green-100">
                Notifications
            </h2>

            <p class="mt-1 text-sm/6 text-green-800 dark:text-green-200">
                We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>

            <div class="mt-10 space-y-10">
                <fieldset>
                    <legend class="text-lg/6 font-semibold text-gray-900 dark:text-green-100">
                        By email
                    </legend>

                    <div class="mt-6 space-y-6">
                        <div class="flex gap-3">
                            <div class="flex h-6 shrink-0 items-center">
                                <div class="group grid size-4 grid-cols-1">
                                    <input
                                        id="comments"
                                        aria-describedby="comments-description"
                                        name="comments"
                                        type="checkbox"
                                        checked=""
                                        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-green-50 checked:border-sky-600 checked:bg-sky-600 indeterminate:border-sky-600 indeterminate:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:indeterminate:border-sky-500 dark:indeterminate:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:checked:bg-green-50/10 forced-colors:appearance-auto"
                                    />
                                    <svg
                                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div class="text-sm/6">
                                <label for="comments" class="font-medium text-gray-900 dark:text-green-100">
                                    Comments
                                </label>

                                <p id="comments-description" class="text-green-800 dark:text-green-200">
                                    Get notified when someones posts a comment on a posting.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div class="flex h-6 shrink-0 items-center">
                                <div class="group grid size-4 grid-cols-1">
                                    <input
                                        id="candidates"
                                        aria-describedby="candidates-description"
                                        name="candidates"
                                        type="checkbox"
                                        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-green-50 checked:border-sky-600 checked:bg-sky-600 indeterminate:border-sky-600 indeterminate:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:indeterminate:border-sky-500 dark:indeterminate:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:checked:bg-green-50/10 forced-colors:appearance-auto"
                                    />
                                    <svg
                                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div class="text-sm/6">
                                <label for="candidates" class="font-medium text-gray-900 dark:text-green-100">
                                    Candidates
                                </label>

                                <p id="candidates-description" class="text-green-800 dark:text-green-200">
                                    Get notified when a candidate applies for a job.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div class="flex h-6 shrink-0 items-center">
                                <div class="group grid size-4 grid-cols-1">
                                    <input
                                        id="offers"
                                        aria-describedby="offers-description"
                                        name="offers"
                                        type="checkbox"
                                        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-green-50 checked:border-sky-600 checked:bg-sky-600 indeterminate:border-sky-600 indeterminate:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:indeterminate:border-sky-500 dark:indeterminate:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:checked:bg-green-50/10 forced-colors:appearance-auto"
                                    />
                                    <svg
                                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25 dark:group-has-[:disabled]:stroke-white/25"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <div class="text-sm/6">
                                <label for="offers" class="font-medium text-gray-900 dark:text-green-100">
                                    Licensing requests
                                </label>

                                <p id="offers-description" class="text-green-800 dark:text-green-200">
                                    Get notified when a licensing request is submitted.
                                </p>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend class="text-lg/6 font-semibold text-gray-900 dark:text-green-100">
                        Push notifications
                    </legend>

                    <p class="mt-1 text-sm/6 text-green-800 dark:text-green-200">
                        These are delivered via SMS to your mobile phone.
                    </p>

                    <div class="mt-6 space-y-6">
                        <div class="flex items-center gap-x-3">
                            <input
                                id="push-everything"
                                name="push-notifications"
                                type="radio"
                                checked=""
                                class="relative size-4 appearance-none rounded-full border border-gray-300 bg-green-50 before:absolute before:inset-1 before:rounded-full before:bg-green-50 checked:border-sky-600 checked:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:before:bg-green-50/20 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                            />
                            <label for="push-everything" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">Everything</label>
                        </div>

                        <div class="flex items-center gap-x-3">
                            <input
                                id="push-email"
                                name="push-notifications"
                                type="radio"
                                class="relative size-4 appearance-none rounded-full border border-gray-300 bg-green-50 before:absolute before:inset-1 before:rounded-full before:bg-green-50 checked:border-sky-600 checked:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:before:bg-green-50/20 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                            />
                            <label for="push-email" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">Same as email</label>
                        </div>

                        <div class="flex items-center gap-x-3">
                            <input
                                id="push-nothing"
                                name="push-notifications"
                                type="radio"
                                class="relative size-4 appearance-none rounded-full border border-gray-300 bg-green-50 before:absolute before:inset-1 before:rounded-full before:bg-green-50 checked:border-sky-600 checked:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-green-50/5 dark:checked:border-sky-500 dark:checked:bg-sky-500 dark:focus-visible:outline-sky-500 dark:disabled:border-white/5 dark:disabled:bg-green-50/10 dark:disabled:before:bg-green-50/20 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                            />
                            <label for="push-nothing" class="block text-sm/6 font-medium text-gray-900 dark:text-green-100">No push notifications</label>
                        </div>
                    </div>
                </fieldset>
            </div>
        </section>
    </main>
</template>

<script setup>
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
</script>
