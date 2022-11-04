import MerkleTree from "./MerkleTree";
import crypto from 'node:crypto';


type CreateCoinbaseTransactionRequest = {

    version : number,
    blockHeight: number,
    value : bigint,


        
}

export default class BlockUtil {


    static createCoinbaseTransaction(req : CreateCoinbaseTransactionRequest) : string {
        // Transaction version: 48
        const versionBuf = Buffer.alloc(4);
        versionBuf.writeUInt32LE(req.version);
        const version = versionBuf.toString('hex');

        // Input Count: 0
        const inputCount = "00"

        // Transaction ID (none) 32 bytes, 64 hex characters
        const txId = "0101000000000000000000000000000000000000000000000000000000000000";

        // Number of outputs being spent. (none)
        const vOut = "0000ffff"

        // Normally references a script to lock funds, but here we encode whatever data we want.
        const scriptSize = "45";
        // Bip32 requires us to encode new block height (310) in Little-Endian
        const blockHeightBuffer = Buffer.alloc(1);
        blockHeightBuffer.writeUintLE(req.blockHeight, 0, 1);
        const blockHeightHex = blockHeightBuffer.toString('hex');
        const scriptHash = `01${blockHeightHex}t1359062f48616f4254432f53756e204368756e2059753a205a6875616e67205975616e2c2077696c6c20796f75206d61727279206d653f2f06fcc9cacc19c5f278560300`;

        // Output Count: 0
        const outputCount = "01"

        // Transaction Value: 100 sats
        const valueBuf = Buffer.alloc(8);
        valueBuf.writeBigInt64LE(req.value);
        const value = valueBuf.toString('hex');
        
        // Hash used as reference to script that locks bitcoin
        const lockingScriptSize = "19";
        const lockingScriptHash = "76a914fde0a08625e327ba400644ad62d5c571d2eec3de88ac";

        // Lock time
        const lockTime = "00000000";

        const coinbaseTx = `${version}${inputCount}${txId}${vOut}${scriptSize}${scriptHash}${outputCount}${valueBuf}${lockingScriptSize}${lockingScriptHash}${lockTime}`

        console.debug(`Unhashed coinbase transaction: ${coinbaseTx}`);
        console.debug(` Version: ${version}\n Input: ${inputCount}\n TxId: ${txId}\n Vout: ${vOut}\n ScriptSize: ${scriptSize}\n ScriptHash: ${scriptHash} \n` +
            ` OutputCount: ${outputCount}\n Value: ${value}\n LockingScriptSize: ${lockingScriptSize}\n LockingScriptHash: ${lockingScriptHash}\n LockTime: ${lockTime}\n`)

        return coinbaseTx;
    }


    /**
     * All fields have their bytes in Little-Endian order where the least significant bytes are first.
     * @returns 
     */
    static createBlockHeader() : string {

        // Block version 3
        let versionBuf = Buffer.alloc(8);
        versionBuf.writeUInt16LE(2);
        let version = versionBuf.toString('hex');

        // block timestamp: time since unix epoch in seconds
        let timeBuf = Buffer.alloc(4);
        timeBuf.writeUint32LE(Date.now()/1_000);
        let time = timeBuf.toString('hex');
    
        // Easiest mining difficulty
        // [  exponent  ][          signficant bits               ]
        // [4bits][4bits][4bits][4bits][4bits][4bits][4bits][4bits]
        // 0x7fffff * 256^(0x20 - 3)
        let miningDifficulty = "207fffff";
        // Nonce makes each hash different even if everything is the same.
        let nonceBuf = Buffer.alloc(4);
        nonceBuf.writeUInt32LE(crypto.getRandomValues(new Uint32Array(1))[0]);
        let nonce = nonceBuf.toString('hex');
    
        // If only coinbaseTx in block, then hash will be coinBaseTxId
        let merkelRootHashBE = MerkleTree.computeHash(["b0b47252fc47356a3c377941ca2b903de31d72acc778f57c577ca05e8130d03e"]);
        let merkelRootHash = Buffer.from(merkelRootHashBE, 'hex').reverse().toString('hex');
        let previousBlockHashBE = MerkleTree.hashTwice("6c90bf364a3959723f99dea7b9079b779791dd9186fe4a79c1c58959327e22f9");
        let previousBlockHash = Buffer.from(previousBlockHashBE, 'hex').reverse().toString('hex');


        console.debug(` Version: ${version}\n PreviousBlockHash:${previousBlockHash}\n MerkleRootHash: ${merkelRootHash}\n Time: ${time}\n MiningDifficulty: ${miningDifficulty}\n Nonce: ${nonce}\n`);
        
        return `${version}${previousBlockHash}${merkelRootHash}${time}${miningDifficulty}${nonce}`;

    }


    static createBlock() : string {
        return BlockUtil.createBlockHeader() + BlockUtil.createCoinbaseTransaction({version:2, blockHeight:2, value:100n});
    }

}