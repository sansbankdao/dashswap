<template>
    <main class="mt-10 lg:mt-0">
        <h2 class="text-lg font-medium text-gray-900">
            Launch Summary
        </h2>

        <div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <h3 class="sr-only">Items in your cart</h3>
            <ul role="list" class="divide-y divide-gray-200">
                <li v-for="product in products" :key="product.id" class="flex px-4 py-6 sm:px-6">
                    <div class="shrink-0">
                        <SparklesIcon class="size-12 text-gray-500" />
                        <!-- <img :src="product.imageSrc" :alt="product.imageAlt" class="w-20 rounded-md" /> -->
                    </div>

                    <div class="ml-6 flex flex-1 flex-col">
                        <div class="flex">
                            <div class="min-w-0 flex-1">
                                <h4 class="text-sm">
                                    <a :href="product.href" class="font-medium text-gray-700 hover:text-gray-800">{{ product.title }}</a>
                                </h4>

                                <p class="mt-1 text-sm text-gray-500">{{ product.color }}</p>

                                <p class="mt-1 text-sm text-gray-500">{{ product.size }}</p>
                            </div>

                            <div class="ml-4 flow-root shrink-0">
                                <button type="button" class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500">
                                    <span class="sr-only">Remove</span>
                                    <TrashIcon class="size-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-1 items-end justify-between pt-2">
                            <p class="mt-1 text-sm font-medium text-gray-900">{{ product.price }}</p>

                            <div class="ml-4">
                                <div class="grid grid-cols-1">
                                    <select
                                        id="quantity"
                                        name="quantity"
                                        aria-label="Quantity"
                                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                    <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Token Document Source -->
            <pre class="h-64 p-3 bg-amber-300 text-xs overflow-x-hidden overflow-y-scroll">{{refTokenDoc}}</pre>

            <section class="grid grid-cols-2">
                <button class="w-full px-3 py-2 bg-blue-400">
                    Copy to Clipboard
                </button>

                <button class="w-full px-3 py-2 bg-pink-400">
                    Self-deploy Guide
                </button>
            </section>

            <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex items-center justify-between">
                    <dt class="text-sm">Platform cost</dt>
                    <dd class="text-sm font-medium text-gray-900">0.4814 DASH</dd>
                </div>

                <div class="flex items-center justify-between">
                    <dt class="text-sm">Additional cost(s)</dt>
                    <dd class="text-sm font-medium text-gray-900">0.2847 DASH</dd>
                </div>

                <div class="flex items-center justify-between">
                    <dt class="text-sm">Transaction fees</dt>
                    <dd class="text-sm font-medi
                    um text-gray-900">0.01337 DASH</dd>
                </div>

                <section class="flex flex-col gap-3 border-t border-gray-200 pt-6">
                    <div class="flex items-center justify-between">
                        <dt class="text-base font-medium">DASH Total</dt>
                        <dd class="text-base font-medium text-gray-900">0.712</dd>
                    </div>

                    <div class="flex items-center justify-between">
                        <dt class="text-base font-medium">USD Total</dt>
                        <dd class="text-base font-medium text-gray-900">$18.77</dd>
                    </div>
                </section>
            </dl>

            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                    type="submit"
                    class="w-full rounded-md border border-transparent bg-sky-600 px-4 py-3 text-xl font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                    Confirm Your Launch
                </button>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'
import { SparklesIcon } from '@heroicons/vue/24/outline';

const products = [
    {
        id: 1,
        title: 'Basic Token Creation',
        href: '#',
        price: 'Required',
        color: '$MY_TOKEN',
        size: '0.2 DASH',
        imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-01.jpg',
        imageAlt: `Front of men's Basic Tee in black.`,
    },
    {
        id: 2,
        title: 'Searchable Keyword',
        href: '#',
        price: 'Optional',
        color: 'Sienna',
        size: '0.1 DASH',
        imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-02.jpg',
        imageAlt: `Front of men's Basic Tee in sienna.`,
    },
]


const refTokenDoc = ref({
  "0": {
    "$format_version": "0",
    "conventions": {
      "$format_version": "0",
      "localizations": {
        "en": {
          "$format_version": "0",
          "shouldCapitalize": true,
          "singularForm": "DUSD",
          "pluralForm": "DUSD"
        }
      },
      "decimals": 6
    },
    "conventionsChangeRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "baseSupply": 100000000,
    "maxSupply": null,
    "keepsHistory": {
      "$format_version": "0",
      "keepsTransferHistory": true,
      "keepsFreezingHistory": true,
      "keepsMintingHistory": true,
      "keepsBurningHistory": true,
      "keepsDirectPricingHistory": true,
      "keepsDirectPurchaseHistory": true
    },
    "startAsPaused": false,
    "allowTransferToFrozenBalance": true,
    "maxSupplyChangeRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "distributionRules": {
      "$format_version": "0",
      "perpetualDistribution": null,
      "perpetualDistributionRules": {
        "V0": {
          "authorized_to_make_change": "NoOne",
          "admin_action_takers": "NoOne",
          "changing_authorized_action_takers_to_no_one_allowed": false,
          "changing_admin_action_takers_to_no_one_allowed": false,
          "self_changing_admin_action_takers_allowed": false
        }
      },
      "preProgrammedDistribution": null,
      "newTokensDestinationIdentity": "3sL6q6eVCR6y8Ld6Gr14cedhJWNBPmBp3S5VtRcckxzE",
      "newTokensDestinationIdentityRules": {
        "V0": {
          "authorized_to_make_change": "NoOne",
          "admin_action_takers": "NoOne",
          "changing_authorized_action_takers_to_no_one_allowed": false,
          "changing_admin_action_takers_to_no_one_allowed": false,
          "self_changing_admin_action_takers_allowed": false
        }
      },
      "mintingAllowChoosingDestination": false,
      "mintingAllowChoosingDestinationRules": {
        "V0": {
          "authorized_to_make_change": "NoOne",
          "admin_action_takers": "NoOne",
          "changing_authorized_action_takers_to_no_one_allowed": false,
          "changing_admin_action_takers_to_no_one_allowed": false,
          "self_changing_admin_action_takers_allowed": false
        }
      },
      "changeDirectPurchasePricingRules": {
        "V0": {
          "authorized_to_make_change": "ContractOwner",
          "admin_action_takers": "ContractOwner",
          "changing_authorized_action_takers_to_no_one_allowed": false,
          "changing_admin_action_takers_to_no_one_allowed": false,
          "self_changing_admin_action_takers_allowed": false
        }
      }
    },
    "marketplaceRules": {
      "$format_version": "0",
      "tradeMode": "NotTradeable",
      "tradeModeChangeRules": {
        "V0": {
          "authorized_to_make_change": "ContractOwner",
          "admin_action_takers": "ContractOwner",
          "changing_authorized_action_takers_to_no_one_allowed": false,
          "changing_admin_action_takers_to_no_one_allowed": false,
          "self_changing_admin_action_takers_allowed": false
        }
      }
    },
    "manualMintingRules": {
      "V0": {
        "authorized_to_make_change": "ContractOwner",
        "admin_action_takers": "ContractOwner",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "manualBurningRules": {
      "V0": {
        "authorized_to_make_change": "ContractOwner",
        "admin_action_takers": "ContractOwner",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "freezeRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "unfreezeRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "destroyFrozenFundsRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "emergencyActionRules": {
      "V0": {
        "authorized_to_make_change": "NoOne",
        "admin_action_takers": "NoOne",
        "changing_authorized_action_takers_to_no_one_allowed": false,
        "changing_admin_action_takers_to_no_one_allowed": false,
        "self_changing_admin_action_takers_allowed": false
      }
    },
    "mainControlGroup": null,
    "mainControlGroupCanBeModified": "NoOne",
    "description": "Dash USD (DUSD), an instant settlement, low-fee stablecoin with built-in censorship resistance."
  }
})
</script>
