/* libs/dashconnect/primitives.ts
 *
 * Crypto primitives for the DashConnect (App Connect v2) modules:
 * hash160, compressed secp256k1 helpers, ECDH + HKDF session-key derivation,
 * and sensitive-buffer clearing. Kept in one place so every module derives
 * keys the same way.
 *
 * Ported from: yappr vendor/platform-auth/src/key-exchange/yappr-protocol.ts
 * (hash160, deriveYapprSharedSecret, clearSensitiveBytes, decodeYapprIdentityId)
 */

import * as secp256k1 from '@noble/secp256k1'
import { hkdf } from '@noble/hashes/hkdf.js'
import { ripemd160 } from '@noble/hashes/legacy.js'
import { sha256 } from '@noble/hashes/sha2.js'
import bs58 from 'bs58'

/** The shared salt of the key-exchange family; App Connect adds its own `info`. */
export const KEY_EXCHANGE_HKDF_SALT = 'dash:key-exchange:v1'
export const NO_HKDF_INFO = new Uint8Array(0)

const encoder = new TextEncoder()

export function hash160(data: Uint8Array): Uint8Array {
    return ripemd160(sha256(data))
}

export function hash256(data: Uint8Array): Uint8Array {
    return sha256(sha256(data))
}

export function generateEphemeralKeyPair(): { privateKey: Uint8Array; publicKey: Uint8Array } {
    const privateKey = secp256k1.utils.randomSecretKey()
    const publicKey = secp256k1.getPublicKey(privateKey, true)
    return { privateKey, publicKey }
}

export function getPublicKey(privateKey: Uint8Array): Uint8Array {
    return secp256k1.getPublicKey(privateKey, true)
}

/**
 * ECDH over secp256k1, then HKDF-SHA256 with the family salt. The optional
 * `info` separates protocol versions: App Connect v2 passes
 * `app-connect:v2`, so a v2 key never equals a legacy v1 key.
 */
export function deriveSharedSecret(
    appEphemeralPrivateKey: Uint8Array,
    walletEphemeralPublicKey: Uint8Array,
    info: Uint8Array = NO_HKDF_INFO,
): Uint8Array {
    const sharedPoint = secp256k1.getSharedSecret(appEphemeralPrivateKey, walletEphemeralPublicKey)
    const sharedX = sharedPoint.slice(1, 33)
    try {
        return hkdf(
            sha256,
            sharedX,
            encoder.encode(KEY_EXCHANGE_HKDF_SALT),
            info,
            32,
        )
    } finally {
        sharedPoint.fill(0)
        sharedX.fill(0)
    }
}

export function clearSensitiveBytes(bytes: Uint8Array): void {
    bytes.fill(0)
}

export function decodeIdentityId(identityIdBase58: string): Uint8Array {
    const decoded = bs58.decode(identityIdBase58)
    if (decoded.length !== 32) {
        throw new Error(`Invalid identity ID length: expected 32, got ${decoded.length}`)
    }
    return decoded
}
