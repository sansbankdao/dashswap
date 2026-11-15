/* libs/dashconnect/extension.ts
 *
 * Pshenmic's Dash Platform Extension (browser wallet) — the injected
 * signer surface the dApp is allowed to touch.
 *
 * Contract (verified from the extension's own source, v1.5.3
 * src/injected/ExtensionSigner.ts, and the 1.5.3_0 installed bundle):
 *   window.dashPlatformExtension = { signer }
 *   - await signer.connect(): Promise<WalletInfo>
 *       { currentIdentity: string|null, identities: {identifier, type,
 *         proTxHash}[] } — origin-scoped approval popup (430x600), poll
 *       loop, throws 'App connection was rejected' / timeout.
 *   - await signer.signAndBroadcast(st: string): Promise<SignedStateTransitionData>
 *       { signedHash, signedBase64 } — hex OR base64 (a 32-char hex prefix
 *       switches the encoding); the extension SIGNS AND BROADCASTS itself;
 *       the dApp never holds these keys and never broadcasts for them.
 *
 * The extension is a signer wallet, NOT an App Connect v2 wallet: no
 * request v2, no loginKeyResponse. DashSwap therefore ORCHESTRATES App
 * Connect v2 itself on top of this signer (build the session-key
 * IdentityUpdate here, the user approves it in the extension popup) — see
 * stores/dashconnect.ts connectExtensionSession().
 */

/** The signer as injected by the extension (structurally typed — the real
 * classes come from the extension's own bundle, not ours). */
export interface ExtensionSigner {
    connect: () => Promise<ExtensionWalletInfo>
    signAndBroadcast: (stateTransition: string) => Promise<ExtensionSignedStateTransition>
}

/** `WalletInfo` — what connect() resolves with. */
export interface ExtensionWalletInfo {
    currentIdentity: string | null
    identities: Array<{
        identifier: string
        type: string
        proTxHash: string | null
    }>
}

/** `SignedStateTransitionData` — what signAndBroadcast() resolves with. */
export interface ExtensionSignedStateTransition {
    signedHash: string
    signedBase64: string
}

/** Detect the extension signer. Returns null outside a browser or when the
 * extension is not installed/enabled (the injected global exists on every
 * page the extension's content script runs on, from document_start). */
export function getExtensionSigner(): ExtensionSigner | null {
    if (typeof window === 'undefined') return null

    const injected = (window as unknown as {
        dashPlatformExtension?: { signer?: ExtensionSigner }
    }).dashPlatformExtension

    if (!injected?.signer || typeof injected.signer.connect !== 'function') {
        return null
    }

    return injected.signer
}

/** Whether a Pshenmic browser wallet is available on this page. */
export function hasExtensionWallet(): boolean {
    return getExtensionSigner() !== null
}

/** Ask the wallet to connect this origin. Resolves with the approved
 * identity list; throws the extension's own errors verbatim (rejected /
 * timeout / no wallet). */
export async function connectExtensionWallet(): Promise<ExtensionWalletInfo> {
    const signer = getExtensionSigner()

    if (signer === null) {
        throw new Error('Dash Platform Extension not detected in this browser.')
    }

    return await signer.connect()
}
