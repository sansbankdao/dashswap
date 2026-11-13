/* libs/dashconnect/bytes.ts
 *
 * Byte codecs shared by the DashConnect modules. Platform surfaces binary
 * fields in several shapes depending on the path the value took: `Uint8Array`
 * from typed SDK objects, `number[]` after a JSON round trip, base64 strings
 * from `toJSON()`, and hex strings from the wasm identity-key getters.
 * Everything that needs bytes goes through `normalizeBytes` (lenient, `null`
 * on failure) or `requireBytes` (throws).
 *
 * Ported from: yappr lib/bytes.ts (subset used by the DashConnect port)
 */

const HEX_PATTERN = /^[0-9a-fA-F]*$/

/** The parts joined end to end into one new array. */
export function concatBytes(...parts: Uint8Array[]): Uint8Array {
    const out = new Uint8Array(parts.reduce((total, part) => total + part.length, 0))
    let offset = 0
    for (const part of parts) {
        out.set(part, offset)
        offset += part.length
    }
    return out
}

export function bytesToBase64(bytes: Uint8Array): string {
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]!)
    }
    return btoa(binary)
}

/** Decode standard base64. Throws on malformed input. */
export function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

export function bytesToHex(bytes: Uint8Array): string {
    let hex = ''
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i]!.toString(16).padStart(2, '0')
    }
    return hex
}

export function hexToBytes(hex: string): Uint8Array {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex
    if (!HEX_PATTERN.test(clean) || clean.length % 2 !== 0) throw new Error('invalid hex')
    const out = new Uint8Array(clean.length / 2)
    for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
    return out
}

/**
 * Lenient byte coercion: `Uint8Array`, base64 strings (the SDK's `toJSON()`
 * shape), hex strings (the wasm key getters) and plain number arrays. `null`
 * when the value cannot be read faithfully.
 */
export function normalizeBytes(data: unknown): Uint8Array | null {
    if (data instanceof Uint8Array) return data
    if (Array.isArray(data) && data.every((entry) => typeof entry === 'number' && entry >= 0 && entry <= 255)) {
        return Uint8Array.from(data as number[])
    }
    if (typeof data === 'string') {
        if (HEX_PATTERN.test(data) && data.length % 2 === 0 && data.length > 0) {
            try {
                return hexToBytes(data)
            } catch {
                /* fall through to base64 */
            }
        }
        try {
            return base64ToBytes(data)
        } catch {
            return null
        }
    }
    return null
}

/** `normalizeBytes`, but throwing when the value cannot be read faithfully. */
export function requireBytes(data: unknown, what: string): Uint8Array {
    const bytes = normalizeBytes(data)
    if (!bytes) throw new Error(`${what} is not readable bytes`)
    return bytes
}
