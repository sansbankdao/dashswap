/**
 * Create Identity
 *
 * Generate the Asset Lock Proof required to create a new Identity.
 */
export default function () {
    // With ChainLocks
    const chain_locked_height = 2325021
    const tx_id = '00000000000000135ce508cd5783daa69566c24a1112d0bee7aa1872ec155c51'
    const outputIndex = 1

    const outpoint = new OutPointWASM(tx_id, outputIndex)

    const assetLockProof = AssetLockProofWASM.createChainAssetLockProof(chain_locked_height, outpoint)
    console.log('ASSET LOCK PROOF', assetLockProof)
    console.log('ASSET LOCK PROOF (object)', assetLockProof.toObject())
    console.log('ASSET LOCK PROOF (string)', assetLockProof.toString())
    console.log('ASSET LOCK PROOF (lock type)', assetLockProof.getLockType())
    // console.log('ASSET LOCK PROOF (instant)', assetLockProof.getInstantLockProof())
    console.log('ASSET LOCK PROOF (regular)', assetLockProof.getChainLockProof())
}
