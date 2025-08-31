import { entropyToMnemonic } from '@ethersproject/hdnode'
import init, {
    WasmSdkBuilder,
    derive_key_from_seed_phrase,
    derive_key_from_seed_with_path,
    derive_key_from_seed_with_extended_path,
    get_identity_by_non_unique_public_key_hash,
    prefetch_trusted_quorums_mainnet,
    prefetch_trusted_quorums_testnet,
} from '../../libs/dash/wasm_sdk.js'

const CURRENT_NETWORK = 'testnet'

export default async function (_entropy) {
console.log('SEARCHING FOR MY IDENTITY...', this._entropy)

    const mnemonic = entropyToMnemonic(this._entropy)
console.log('MNEMONIC', mnemonic)

    // Derive key from seed phrase
    const result1 = await derive_key_from_seed_phrase(
        mnemonic,
        '',
        CURRENT_NETWORK,
    )
console.log('RESULT-1', result1)

    // const pathStr = `m/44'/5'/0'/0/0`
    const pathStr = `m/9'/5'/5'/0'/0'/0'/0'`
    const result2 = await derive_key_from_seed_with_extended_path(
        mnemonic,
        null,
        pathStr,
        CURRENT_NETWORK,
    )
console.log('RESULT-2', result2)

    /* Initialize WASM module. */
    await init()

    /* Pre-fretch trusted (TESTNET) quorums. */
    await prefetch_trusted_quorums_testnet()

    /* Initialize SDK. */
    const sdk = await WasmSdkBuilder
        .new_testnet_trusted()
        .build()

    const publicKeyHash = '879a4c75756c39701e2ab2a4cead818384c8463f'
    const result3 = await get_identity_by_non_unique_public_key_hash(
            sdk,
            publicKeyHash,
            null,
          )
console.log('RESULT-3', result3)

    let dip13Path

    const subFeature = 0
    const identityIndex = 0
    const keyIndex = 0

    // Generate the same keys as shown in the preview
    const coinType = CURRENT_NETWORK === 'mainnet' ? 5 : 1;

    switch (subFeature) {
    case 0: // Authentication keys
        // m / 9' / coin_type' / 5' / 0' / key_type' / identity_index' / key_index'
        // For now, we'll use ECDSA (0') as key type
        const keyType = 0; // ECDSA
        dip13Path = `m/9'/${coinType}'/5'/0'/${keyType}'/${identityIndex}'/${keyIndex || 0}'`
        break
    case 1: // Registration Funding keys
        // m / 9' / coin_type' / 5' / 1' / identity_index
        dip13Path = `m/9'/${coinType}'/5'/1'/${identityIndex}`;
        break
    case 2: // Top Up Funding keys
        // m / 9' / coin_type' / 5' / 2' / funding_index
        dip13Path = `m/9'/${coinType}'/5'/2'/${identityIndex}`;
        break
    case 3: // Invitation Funding keys
        // m / 9' / coin_type' / 5' / 3' / funding_index'
        dip13Path = `m/9'/${coinType}'/5'/3'/${identityIndex}'`;
        break
    default:
        throw new Error('Invalid sub-feature selected');
    }
console.log('DIP-13 PATH', dip13Path)

    // let publicKeys = []

    // const assetLockProof = null // THIS WILL BE PURCHASED BY CLIENT FROM PLATFORM
    // const privateKey = null // THIS WILL BE PURCHASED BY CLIENT FROM PLATFORM

    // // Master key (authentication, master level)
    // const masterKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/0'`;
    // const masterKey = derive_key_from_seed_with_path(mnemonic, undefined, masterKeyPath, CURRENT_NETWORK);
    // console.log('Master key object:', masterKey);
    // console.log('Master key fields:', Object.keys(masterKey || {}));

    // // Additional authentication key (high security)
    // const authKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/1'`;
    // const authKey = derive_key_from_seed_with_path(mnemonic, undefined, authKeyPath, currentNetwork);

    // // Transfer key (critical security)
    // const transferKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/2'`;
    // const transferKey = derive_key_from_seed_with_path(mnemonic, undefined, transferKeyPath, currentNetwork);

    // // Create public key objects for the SDK
    // // Pass private keys so the SDK can derive the correct public key data using DPP
    // publicKeys = [
    //     {
    //         id: 0,
    //         keyType: "ECDSA_HASH160",
    //         purpose: "AUTHENTICATION",
    //         securityLevel: "MASTER",
    //         privateKeyHex: masterKey.private_key_hex,
    //         readOnly: false
    //     },
    //     {
    //         id: 1,
    //         keyType: "ECDSA_HASH160",
    //         purpose: "AUTHENTICATION",
    //         securityLevel: "HIGH",
    //         privateKeyHex: authKey.private_key_hex,
    //         readOnly: false
    //     },
    //     {
    //         id: 2,
    //         keyType: "ECDSA_HASH160",
    //         purpose: "TRANSFER",
    //         securityLevel: "CRITICAL",
    //         privateKeyHex: transferKey.private_key_hex,
    //         readOnly: false
    //     }
    // ]

    // // Handle identity create with asset lock proof
    // const result = await sdk.identityCreate(
    //     assetLockProof,
    //     privateKey,
    //     JSON.stringify(publicKeys)
    // )

    // Master key (authentication, master level)
    const masterKeyPath = `m/9'/${CURRENT_NETWORK === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/0'`
    const masterKey = derive_key_from_seed_with_path(mnemonic, undefined, masterKeyPath, CURRENT_NETWORK)
console.log('MASTER KEY', masterKey)

    // Additional authentication key (high security)
    const authKeyPath = `m/9'/${CURRENT_NETWORK === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/1'`
    const authKey = derive_key_from_seed_with_path(mnemonic, undefined, authKeyPath, CURRENT_NETWORK)
console.log('AUTH KEY', authKey)

    // Transfer key (critical security)
    const transferKeyPath = `m/9'/${CURRENT_NETWORK === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/2'`
    const transferKey = derive_key_from_seed_with_path(mnemonic, undefined, transferKeyPath, CURRENT_NETWORK)
console.log('TRANSFER KEY', transferKey)
}
