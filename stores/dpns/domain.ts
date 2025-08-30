/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'
import { PrivateKeyWASM } from 'pshenmic-dpp'
import { hash256, randomBytes } from '@nexajs/crypto'
import { binToHex, hexToBin } from '@nexajs/utils'

/* Set top-level domain. */
const TOP_LEVEL_DOMAIN = 'dash'

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

const label = username
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

    const documentType = 'domain'
    // const documentType = 'preorder'

    // const binSalt = new Uint8Array(domain.preorderSalt)
    const preorderSaltHex = 'ed1256046619088ab47516d50f36eb178a504f4f90acc0e43eab76071ef1c6c8'
    const preorderSalt = Array.from(hexToBin(preorderSaltHex)).flat()
console.log('PREORDER SALT', preorderSalt)

    const data = {
        label: username,
        normalizedLabel: normalized,
        normalizedParentDomainName: TOP_LEVEL_DOMAIN,
        parentDomainName: TOP_LEVEL_DOMAIN,
        preorderSalt,
        records: {
            identity: [
            2,
            158,
            223,
            197,
            123,
            81,
            7,
            238,
            12,
            76,
            172,
            80,
            140,
            83,
            226,
            142,
            105,
            70,
            241,
            22,
            96,
            252,
            253,
            108,
            170,
            22,
            46,
            126,
            43,
            214,
            108,
            29
            ]
        },
        subdomainRules: {
            allowSubdomains: false
        }
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
