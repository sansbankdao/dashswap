/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'
import { PrivateKeyWASM } from 'pshenmic-dpp'
import { hash256, randomBytes } from '@nexajs/crypto'
import { binToHex } from '@nexajs/utils'

/* Set top-level domain. */
const TOP_LEVEL_DOMAIN = '.dash'

export default async (_val1, _val2) => {
console.log('REGISTRATION TEST...')

    /* Initialize SDK. */
    const sdk = new DashPlatformSDK({ network: 'testnet' })

    const IDENTITY = 'BpmWfi2G7F4MhSv6tjCmeP3SeHyK3SWRZ8XeawM2RdXs'
    const AUTH_KEY = 'cViL1FNW4ryhFjUaQxHbKXFkjiXv2N7oSeJiaGPS1gFeUiCrtstp'

const username = 'tis-a-3rd-party-dpns-reg'
const normalizedUsername = sdk.utils.convertToHomographSafeChars(username)
// console.log('USERNAMES', username, normalizedUsername)

// const myUsername = 'tranquil-untaken-sultry'

const label = username + TOP_LEVEL_DOMAIN
console.log('\nLABEL', label)
const normalized = sdk.utils.convertToHomographSafeChars(label)
console.log('\nNORMALIZED', normalized)
const encoder = new TextEncoder()
const binLabel = encoder.encode(normalized)
console.log('\nNORMALIZED (bin)', binLabel)


    /* Initialize params. */
    const dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec' // DPNS
    // const dataContractId = '5PT5DFnfWUvE44C7fWwAVFfKuujuWmTixk7LhsWPCpyb'

    const ownerId = IDENTITY

    // const documentType = 'domain'
    const documentType = 'preorder'

    // const binSalt = new Uint8Array(domain.preorderSalt)
const binSalt = randomBytes(32)
console.log('SALT (bin)', binSalt)
console.log('SALT (hex)', binToHex(binSalt))

const totalLength = binSalt.length + binLabel.length
const concat = new Uint8Array(totalLength)
concat.set(binSalt, 0)
concat.set(binLabel, binSalt.length)
console.log('\nCONCAT', concat)

const hashed = hash256(concat)
console.log('\nHASHED', hashed)
console.log('\nHASHED (hex)', binToHex(hashed))

/* Flatten salted domain hash. */
const saltedDomainHash = Array.from(hashed).flat()

console.log('saltedDomainHash', typeof saltedDomainHash, saltedDomainHash)

    const data = {
        // saltedDomainHash: new Uint8Array(testBytes),
        saltedDomainHash,
    }
console.log('DATA', data)

    const revision = BigInt(1) // optional, defaults to 1

    /* Create a new document. */
    const document = await sdk.documents
        .create(dataContractId, documentType, data, ownerId, revision)
        .catch(err => console.error(err))
    // console.log('DOCUMENT', document)
    console.log('DOCUMENT (props)', document?.properties)

    /* Request identity contract nonce. */
    const identityContractNonce = (await sdk.identities
        .getIdentityContractNonce(ownerId, dataContractId))
    console.log('identityContractNonce', identityContractNonce)

    /* Set private key. */
    const privKey = PrivateKeyWASM.fromWIF(AUTH_KEY)

    /* Set identity. */
    const identity = await sdk.identities.getIdentityByIdentifier(IDENTITY)
    console.log(identity)
    console.log(identity?.properties)

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

    const txConfirm = await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
    console.log('CONFIRM', txConfirm)
}
