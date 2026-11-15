<template>
    <!-- Floating launcher (bottom-right) -->
    <button
        class="fixed bottom-4 right-4 z-50 flex items-center justify-center size-14 rounded-full bg-brand-gradient text-white shadow-lg shadow-dash-500/30 hover:scale-105 active:scale-95 transition-transform"
        :aria-label="open ? 'Close support chat' : 'Open support chat'"
        @click="toggle"
    >
        <ChatBubbleLeftRightIcon v-if="!open" class="size-6" />
        <XMarkIcon v-else class="size-6" />
    </button>

    <!-- Panel -->
    <Transition name="chat">
        <div
            v-if="open"
            class="fixed bottom-20 right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface ring-1 ring-line shadow-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-label="Live support chat"
        >
            <!-- Header -->
            <div class="bg-brand-gradient px-4 py-3 flex items-center gap-3">
                <div class="size-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon class="size-4 text-white" />
                </div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-white">DashSwap Support</p>
                    <p class="text-[10px] text-white/70 uppercase tracking-widest">
                        {{ engineUp ? 'Live chat · AI assistant' : 'Coming online' }}
                    </p>
                </div>
            </div>

            <!-- Transcript -->
            <div ref="scroller" class="flex-1 min-h-0 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 max-h-80">
                <p
                    v-for="(msg, i) in transcript"
                    :key="i"
                    class="text-sm leading-relaxed rounded-xl px-3 py-2 max-w-[85%] break-words"
                    :class="msg.role === 'user'
                        ? 'self-end bg-dash-500/20 text-ink1 ring-1 ring-dash-400/30'
                        : 'self-start bg-surface-sunken text-ink2 ring-1 ring-line'"
                >{{ msg.text }}</p>

                <p v-if="sending" class="self-start text-xs text-ink3 animate-pulse px-2">
                    Assistant is typing…
                </p>
            </div>

            <!-- Composer -->
            <div class="border-t border-line p-3 flex gap-2">
                <input
                    v-model="draft"
                    type="text"
                    :placeholder="engineUp ? 'Ask anything about swapping…' : 'Leave your question…'"
                    class="flex-1 min-w-0 rounded-lg bg-surface-sunken ring-1 ring-line px-3 py-2 text-sm text-ink1 focus:ring-2 focus:ring-dash-400 outline-none"
                    :disabled="sending"
                    @keydown.enter="send"
                />
                <button
                    class="rounded-lg bg-brand-gradient px-3 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all disabled:opacity-50"
                    :disabled="sending || !draft.trim()"
                    @click="send"
                >
                    Send
                </button>
            </div>
        </div>
    </Transition>
</template>

<script setup>
/* components/Support/Chat.vue
 *
 * AI-powered live-support chat (bottom-right), wired to the swap API's
 * `/v1/support/chat` endpoint — contract in
 * docs/API-HANDOFF-CHAT-INVENTORY-RESEND.md (§1, API team implements).
 *
 * Until the endpoint exists the widget stays fully functional as a
 * local queue: messages are kept in this browser (sessionStorage) and
 * the assistant line explains support is coming online. When the API
 * team ships the endpoint, the SAME component lights up with zero
 * frontend changes.
 */

import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const Swap = useSwapStore()
const System = useSystemStore()

const open = ref(false)
const draft = ref('')
const sending = ref(false)
const scroller = ref(null)
const engineUp = ref(false)

const STORE_KEY = 'dashswap_chat_transcript'
const SID_KEY = 'dashswap_chat_sid'

const transcript = ref([])

/* Per-browser chat session id (not a secret). */
const sessionId = () => {
    if (typeof sessionStorage === 'undefined') return null
    let sid = sessionStorage.getItem(SID_KEY)
    if (!sid) {
        sid = (crypto?.randomUUID?.() ?? `sid-${Date.now()}-${Math.random().toString(16).slice(2)}`)
        sessionStorage.setItem(SID_KEY, sid)
    }
    return sid
}

const greet = () => {
    if (transcript.value.length > 0) return

    transcript.value = [{
        role: 'assistant',
        text: 'Hi! I can help with swapping, fees, deposits and your wallet. What do you need?',
    }]
    persist()
}

const persist = () => {
    try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(transcript.value))
    } catch { /* storage may be unavailable — chat stays memory-only */ }
}

const restore = () => {
    try {
        const saved = sessionStorage.getItem(STORE_KEY)
        if (saved) transcript.value = JSON.parse(saved) || []
    } catch { /* start fresh */ }
}

const toggle = () => {
    open.value = !open.value
    if (open.value) {
        restore()
        greet()
        probeEngine()
        nextTick(() => scrollBottom())
    }
}

const scrollBottom = () => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

/* Probe: is /v1/support/chat live? (cheap POST with a tiny ping). */
const probeEngine = async () => {
    try {
        const response = await fetch(`${Swap.base}/v1/support/chat`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId(), message: '__ping__', network: System.network }),
            signal: AbortSignal.timeout(6000),
        })
        engineUp.value = response.ok
    } catch {
        engineUp.value = false
    }
}

const send = async () => {
    const text = draft.value.trim()
    if (!text || sending.value) return

    /* User line + clear input immediately. */
    transcript.value.push({ role: 'user', text })
    draft.value = ''
    persist()
    nextTick(() => scrollBottom())

    /* A live assistant asks its own follow-ups when it can't act. */
    if (!engineUp.value) {
        sending.value = true
        await new Promise(r => setTimeout(r, 700))
        transcript.value.push({
            role: 'assistant',
            text: 'Live support is coming online — your question is saved in this browser for the team. Meanwhile: swaps pay a flat 0.3% engine fee, deposits are single-use, and settlement lands on-chain within a minute or two.',
        })
        sending.value = false
        persist()
        nextTick(() => scrollBottom())
        return
    }

    sending.value = true
    try {
        const response = await fetch(`${Swap.base}/v1/support/chat`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId(),
                message: text,
                network: System.network,
            }),
            signal: AbortSignal.timeout(30000),
        })

        const json = await response.json().catch(() => null)

        if (response.ok && json?.reply) {
            transcript.value.push({ role: 'assistant', text: json.reply })
        } else if (response.status === 429) {
            transcript.value.push({ role: 'assistant', text: 'Rate limit hit — give it a few seconds and try again.' })
        } else {
            transcript.value.push({ role: 'assistant', text: 'The assistant hiccuped — try again in a moment.' })
        }
    } catch {
        transcript.value.push({ role: 'assistant', text: 'Connection to the assistant dropped — try again in a moment.' })
    } finally {
        sending.value = false
        persist()
        nextTick(() => scrollBottom())
    }
}
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.chat-enter-from,
.chat-leave-to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
}
</style>
