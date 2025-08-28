<template>
    <main class="mt-6 border-t border-green-200 pt-6">
        <h2 class="text-lg font-medium text-green-800 dark:text-green-200">
            Token Metadata
        </h2>

        <div class="mt-4">
            <label for="email-address" class="block text-sm/6 font-medium text-green-700">
                Token Name (singular)
            </label>

            <div class="mt-2">
                <input
                    type="email"
                    name="email-address"
                    autocomplete="email"
                    class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
            </div>
        </div>

        <div class="mt-4">
            <label for="email-address" class="block text-sm/6 font-medium text-green-700">
                Token Name (plural)
            </label>

            <div class="mt-2">
                <input
                    type="email"
                    name="email-address"
                    autocomplete="email"
                    class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
            </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
                <label for="first-name" class="block text-sm/6 font-medium text-green-700">
                    Base Supply
                </label>

                <div class="mt-2">
                    <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label for="last-name" class="block text-sm/6 font-medium text-green-700">
                    Max Supply
                </label>

                <div class="mt-2">
                    <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        autocomplete="family-name"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label for="city" class="block text-sm/6 font-medium text-green-700">City</label>
                <div class="mt-2">
                    <input
                        type="text"
                        name="city"
                        id="city"
                        autocomplete="address-level2"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <label for="country" class="block text-sm/6 font-medium text-green-700">Country</label>
                <div class="mt-2 grid grid-cols-1">
                    <select
                        id="country"
                        name="country"
                        autocomplete="country-name"
                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                    >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                    </select>
                    <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-green-500 sm:size-4" aria-hidden="true" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <label for="phone" class="block text-sm/6 font-medium text-green-700">Phone</label>
                <div class="mt-2">
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        autocomplete="tel"
                        class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                    />
                </div>
            </div>
        </div>

        <div class="mt-4">
            <label for="email-address" class="block text-sm/6 font-medium text-green-700">
                Keywords (0.1 DASH ea)
            </label>

            <div class="mt-2">
                <input
                    type="email"
                    name="email-address"
                    autocomplete="email"
                    class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
            </div>
        </div>

        <div class="mt-4">
            <label for="email-address" class="block text-sm/6 font-medium text-green-700">
                Description (max 100 chars)
            </label>

            <div class="mt-2">
                <input
                    type="email"
                    name="email-address"
                    autocomplete="email"
                    class="block w-full rounded-md bg-white px-3 py-2 text-base text-green-900 outline outline-1 -outline-offset-1 outline-green-300 placeholder:text-green-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                />
            </div>
        </div>

    </main>
</template>
