import init, {
    derive_key_from_seed_with_path,
} from '../../libs/dash/wasm_sdk.js'

export default async function () {

          // Generate public keys from seed phrase
          const seedPhrase = values.seedPhrase?.trim();
          const identityIndex = parseInt(values.identityIndex || '0');
          const keySelectionMode = values.keySelectionMode || 'default';

          if (!seedPhrase || !validate_mnemonic(seedPhrase)) {
            throw new Error('Invalid seed phrase');
          }


    // // Master key (authentication, master level)
    // const masterKeyPath = `m/9'/${currentNetwork === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/0'`;
    // const masterKey = derive_key_from_seed_with_path(seedPhrase, undefined, masterKeyPath, currentNetwork);

    // // Additional authentication key (high security)
    // const authKeyPath = `m/9'/${currentNetwork === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/1'`;
    // const authKey = derive_key_from_seed_with_path(seedPhrase, undefined, authKeyPath, currentNetwork);

    // // Transfer key (critical security)
    // const transferKeyPath = `m/9'/${currentNetwork === 'mainnet' ? 5 : 1}'/5'/0'/0'/${identityIndex}'/2'`;
    // const transferKey = derive_key_from_seed_with_path(seedPhrase, undefined, transferKeyPath, currentNetwork);


    let publicKeys = []

    const assetLockProof = null // THIS WILL BE PURCHASED BY CLIENT FROM PLATFORM
    const privateKey = null // THIS WILL BE PURCHASED BY CLIENT FROM PLATFORM

    // Generate the same keys as shown in the preview
    const coinType = currentNetwork === 'mainnet' ? 5 : 1;

    // Master key (authentication, master level)
    const masterKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/0'`;
    const masterKey = derive_key_from_seed_with_path(seedPhrase, undefined, masterKeyPath, currentNetwork);
    console.log('Master key object:', masterKey);
    console.log('Master key fields:', Object.keys(masterKey || {}));

    // Additional authentication key (high security)
    const authKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/1'`;
    const authKey = derive_key_from_seed_with_path(seedPhrase, undefined, authKeyPath, currentNetwork);

    // Transfer key (critical security)
    const transferKeyPath = `m/9'/${coinType}'/5'/0'/0'/${identityIndex}'/2'`;
    const transferKey = derive_key_from_seed_with_path(seedPhrase, undefined, transferKeyPath, currentNetwork);

    // Create public key objects for the SDK
    // Pass private keys so the SDK can derive the correct public key data using DPP
    publicKeys = [
        {
            id: 0,
            keyType: "ECDSA_HASH160",
            purpose: "AUTHENTICATION",
            securityLevel: "MASTER",
            privateKeyHex: masterKey.private_key_hex,
            readOnly: false
        },
        {
            id: 1,
            keyType: "ECDSA_HASH160",
            purpose: "AUTHENTICATION",
            securityLevel: "HIGH",
            privateKeyHex: authKey.private_key_hex,
            readOnly: false
        },
        {
            id: 2,
            keyType: "ECDSA_HASH160",
            purpose: "TRANSFER",
            securityLevel: "CRITICAL",
            privateKeyHex: transferKey.private_key_hex,
            readOnly: false
        }
    ]

    // Handle identity create with asset lock proof
    const result = await sdk.identityCreate(
        assetLockProof,
        privateKey,
        JSON.stringify(publicKeys)
    )

}
