/* Import modules. */
import {
    AssetLockProofWASM,
    OutPointWASM,
} from 'pshenmic-dpp'

/**
 * Create Identity
 *
 * Generate the Asset Lock Proof required to create a new Identity.
 */
export default function (_chain_locked_height, _txid) {
    /* Set output index. */
    // NOTE: Output index from your OP_RETURN.
    const outputIndex = 0

    /* Set outpoint. */
    const outpoint = new OutPointWASM(_txid, outputIndex)
// console.log('OUTPUT', outpoint)

    /* Generate asset lock proof. */
    const assetLockProof = AssetLockProofWASM
        .createChainAssetLockProof(_chain_locked_height, outpoint)
// console.log('ASSET LOCK PROOF', assetLockProof)

    /* Convert proof to hex. */
    const assetLockProofHex = assetLockProof.hex()
// console.log('ASSET LOCK PROOF (hex)', assetLockProofHex)

    /* Return asset lock proof (in hex). */
    return assetLockProofHex
}
