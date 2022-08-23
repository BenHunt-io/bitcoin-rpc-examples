import { Encoding } from "node:crypto";
import { version } from "node:os";


type TxInBuffer = {
    txId : Buffer,
    vOut : Buffer,
    scriptSigSize : Buffer;
    scriptSig : Buffer,
    sequence : Buffer
}

type TxIn = {
    txId : string,
    vOut : number,
    scriptSigSize : number;
    scriptSig : string,
    sequence : string
}

type TxOutBuffer = {
    value : Buffer,
    scriptPubKeySize : Buffer;
    scriptPubKey : Buffer,
}

type TxOut = {
    value : bigint,
    scriptPubKeySize : number;
    scriptPubKey : string,
}



/**
 * Constructs a transaction from raw hex encoded transaction data. Continually parses
 * a stream of bytes from start to end with different parsing functions implementing the decoding
 * of each part of the transaction.
 */
export default class Transaction {

    private rawTx;

    // Parsed fields as bytes
    private version? : Buffer;
    private flag? : Buffer;
    private inputCount? : Buffer;
    private inputs : TxInBuffer[] = [];
    private outputCount? : Buffer;
    private outputs : TxOutBuffer[] = [];
    private lockTime? : Buffer;

    // SegWit fields
    private witnessOneSizeBuffer? : Buffer;
    private witnessOne? : Buffer;
    private witnessTwoSizeBuffer? : Buffer;
    private witnessTwo? : Buffer;

    constructor(rawTx: string){
        this.rawTx = rawTx;
        let txBuffer = Buffer.from(rawTx, 'hex');

        txBuffer = this.parseVersion(txBuffer);
        txBuffer = this.parseFlag(txBuffer);
        txBuffer = this.parseInputs(txBuffer);
        txBuffer = this.parseOutputs(txBuffer);
        txBuffer = this.parseWitnesses(txBuffer);
        txBuffer = this.parseLockTime(txBuffer);
    }

    parseVersion(txBuffer : Buffer){
        this.version = txBuffer.subarray(0, 4);
        return txBuffer.subarray(4, txBuffer.length);
    }

    parseFlag(txBuffer : Buffer){
        this.flag = txBuffer.subarray(0, 2);
        return txBuffer.subarray(2, txBuffer.length);
    }

    parseInputs(txBuffer : Buffer){
        // Number of inputs
        this.inputCount = txBuffer.subarray(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);
        let numInputs = this.inputCount.readUintBE(0, 1);

        for(let i = 0; i<numInputs; i++){
            txBuffer = this.parseInput(txBuffer);
        }

        return txBuffer;
    }

    parseInput(txBuffer : Buffer){
        let txIdBuffer = txBuffer.subarray(0, 32);
        txBuffer = txBuffer.subarray(32, txBuffer.length);

        let vOutBuffer = txBuffer.subarray(0, 4);
        txBuffer = txBuffer.subarray(4, txBuffer.length);

        let scriptSigSizeBuffer = txBuffer.subarray(0, 1);
        let scriptSigSize = scriptSigSizeBuffer.readUintBE(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);

        let scriptSigBuffer = txBuffer.subarray(0, scriptSigSize);
        txBuffer = txBuffer.subarray(scriptSigSize, txBuffer.length);

        let sequenceBuffer = txBuffer.subarray(0, 4);
        txBuffer = txBuffer.subarray(4, txBuffer.length);

        this.inputs.push({
            txId : txIdBuffer,
            vOut : vOutBuffer,
            scriptSigSize : scriptSigSizeBuffer,
            scriptSig : scriptSigBuffer,
            sequence : sequenceBuffer
        })

        return txBuffer;
    }

    parseOutputs(txBuffer : Buffer) {
        // Number of outputs
        this.outputCount = txBuffer.subarray(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);
        let numOutputs = this.outputCount.readUintBE(0, 1);

        for(let i = 0; i<numOutputs; i++){
            txBuffer = this.parseOutput(txBuffer);
        }

        return txBuffer;
    }

    parseOutput(txBuffer : Buffer) : Buffer {
        
        // in sats
        let value = txBuffer.subarray(0, 8);
        txBuffer = txBuffer.subarray(8, txBuffer.length);

        let scriptPubKeySizeBuffer = txBuffer.subarray(0, 1);
        let scriptPubKeySize = scriptPubKeySizeBuffer.readUintBE(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);

        let scriptPubKey = txBuffer.subarray(0, scriptPubKeySize);
        txBuffer = txBuffer.subarray(scriptPubKeySize, txBuffer.length);

        this.outputs.push({
            value : value,
            scriptPubKeySize : scriptPubKeySizeBuffer,
            scriptPubKey : scriptPubKey
       });

        return txBuffer;

    }

    parseWitnesses(txBuffer : Buffer) : Buffer {

        let numWitnessesBuffer = txBuffer.subarray(0, 1);
        let numWitnesses = numWitnessesBuffer.readUintBE(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);

        // SegWit 1
        this.witnessOneSizeBuffer = txBuffer.subarray(0, 1);
        let witnessSize = this.witnessOneSizeBuffer.readUintBE(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);

        this.witnessOne = txBuffer.subarray(0, witnessSize);
        txBuffer = txBuffer.subarray(witnessSize, txBuffer.length);

        // Segwit 2
        this.witnessTwoSizeBuffer = txBuffer.subarray(0, 1);
        let witnessTwoSize = this.witnessTwoSizeBuffer.readUintBE(0, 1);
        txBuffer = txBuffer.subarray(1, txBuffer.length);

        this.witnessTwo = txBuffer.subarray(0, witnessTwoSize);
        txBuffer = txBuffer.subarray(witnessTwoSize, txBuffer.length);

        return txBuffer;

    }

    parseLockTime(txBuffer : Buffer){
        this.lockTime = txBuffer.subarray(0, 4);
        txBuffer = txBuffer.subarray(4, txBuffer.length);
        return txBuffer;
    }

    getVersion(){
        return this.version?.readUint32LE();
    }

    getInputCount(){
        return this.inputCount?.readUint8();
    }

    // 0x0001 signals presence of witness data, otherwise omitted
    // Technically split into two sections [marker][flag] both 1 byte each.
    isWitnessFlagPresent(){
        return this.flag?.readUInt16BE() == 1
    }



    getTransactionInputs()  : TxIn[] {
        return this.inputs.map((txInBuffer) => ({
                txId : txInBuffer.txId.reverse().toString('hex'),
                vOut : txInBuffer.vOut.reverse().readUint32BE(),
                scriptSigSize : txInBuffer.scriptSigSize.readUInt8(),
                scriptSig : txInBuffer.scriptSig.toString('hex'),
                sequence : txInBuffer.sequence.toString('hex')
        }));
    }

    getOutputCount(){
        return this.outputCount?.readUint8();
    }

    getTransactionOutputs() : TxOut[] {
        return this.outputs.map((txOutBuffer) => ({
            value : txOutBuffer.value.readBigInt64LE(),
            scriptPubKeySize : txOutBuffer.scriptPubKeySize.readUintBE(0, 1),
            scriptPubKey : txOutBuffer.scriptPubKey.toString('hex')
        }));
    }

    getLockTime(){
        return this.lockTime?.readUint32LE();
    }


    getWitnesses(){
        return [
            {
                size : this.witnessOneSizeBuffer?.readUIntBE(0, 1),
                witness : this.witnessOne?.toString('hex')
            },
            {
                size : this.witnessTwoSizeBuffer?.readUintBE(0, 1),
                witness : this.witnessTwo?.toString('hex')
            }
        ]
    }
    
} 