/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'
import { PrivateKeyWASM } from 'pshenmic-dpp'
import { hash256, randomBytes } from '@nexajs/crypto'
import { binToHex } from '@nexajs/utils'

/* Set top-level domain. */
const TOP_LEVEL_DOMAIN = '.dash'

export default async (_val1, _val2) => {
console.log('EVO COLLECTIBLE TEST...')

    /* Initialize SDK. */
    const sdk = new DashPlatformSDK({ network: 'testnet' })

    const IDENTITY = 'BpmWfi2G7F4MhSv6tjCmeP3SeHyK3SWRZ8XeawM2RdXs'
    const AUTH_KEY = 'cViL1FNW4ryhFjUaQxHbKXFkjiXv2N7oSeJiaGPS1gFeUiCrtstp'

    /* Initialize params. */
    const dataContractId = '2EhcrXyLsM379rdWP2uLLLu8tTr4oxtWwMQPMmpYw95X' // EvoCollectible

    /* Set document type. */
    const documentType = 'media'

    /* Define chunk size. */
    const CHUNK_SIZE = 1024
    const MAX_CHUNKS = 5

    /* Set total length. */
    const totalLength = CHUNK_SIZE * MAX_CHUNKS

    /* Set media data. */
    const mediaData = new Uint8Array(totalLength)

    /* Handle all chunks. */
    for (let i = 0; i < MAX_CHUNKS; i++) {
        mediaData.set(new Uint8Array(randomBytes(CHUNK_SIZE)), CHUNK_SIZE * i)
    }

    /* Flatten salted domain hash. */
    const payload = Array.from(mediaData).flat()

    const data = {
        payload,
    }
console.log('DATA', data)

    const revision = BigInt(1) // optional, defaults to 1

    /* Create a new document. */
    const document = await sdk.documents
        .create(dataContractId, documentType, data, IDENTITY, revision)
        .catch(err => console.error(err))
console.log('DOCUMENT', document?.properties)

    /* Request identity contract nonce. */
    const identityContractNonce = (await sdk.identities
        .getIdentityContractNonce(IDENTITY, dataContractId))
console.log('identityContractNonce', identityContractNonce)

    /* Set private key. */
    const privKey = PrivateKeyWASM.fromWIF(AUTH_KEY)

    /* Set identity. */
    const identity = await sdk.identities.getIdentityByIdentifier(IDENTITY)
console.log('IDENTITY', identity)

    const identityPublicKeys = identity.getPublicKeys()
console.log(identityPublicKeys)

    /* Set public key ID. */
    const publicKeyId = 1 // 01 => Auth (Critical)

    /* Set public key. */
    const pubKey = identityPublicKeys[publicKeyId]

    /* Handle state transition. */
    const stateTransition = await sdk.documents
        .createStateTransition(
            document,
            'create',
            (identityContractNonce + BigInt(1)),
        )
console.log(stateTransition)

    /* Sign state transition. */
    stateTransition.sign(privKey, pubKey)

    /* Assign public key ID. */
    stateTransition.signaturePublicKeyId = publicKeyId

    const txid = await sdk.stateTransitions.broadcast(stateTransition)
console.log('TXID', txid)

    // const txConfirm = await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
// console.log('CONFIRM', txConfirm)
}
