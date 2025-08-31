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
    const sdk = new DashPlatformSDK({ network: 'mainnet' })

    const IDENTITY = ''
    const AUTH_KEY = ''

const username = 'BetaTesterExtraordinaire'
const normalizedUsername = sdk.utils.convertToHomographSafeChars(username)
// console.log('USERNAMES', username, normalizedUsername)

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
    const preorderSaltHex = '136b2f7e66666f31b3882551b39c31445c2a95643f328c5032940fbd66f63c6f'
    const preorderSalt = Array.from(hexToBin(preorderSaltHex)).flat()
console.log('PREORDER SALT', preorderSalt)

// FIXME Use `bs58` library.
// NOTE: This array MUST be flattened.
const targetIdentity = Array.from(hexToBin('0d94fd5e5a16ebb4b984bcbca0ae7dc8670fde1abdc8d66fdee8efeb87fa9fb0')).flat()
console.log('TARGET ID', targetIdentity)

    const data = {
        label: username,
        normalizedLabel: normalized,
        normalizedParentDomainName: TOP_LEVEL_DOMAIN,
        parentDomainName: TOP_LEVEL_DOMAIN,
        preorderSalt,
        records: {
            identity: targetIdentity,
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

    // const txConfirm = await sdk.stateTransitions.waitForStateTransitionResult(stateTransition)
    // console.log('CONFIRM', txConfirm)
}
