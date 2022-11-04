import dotenv from 'dotenv';
import BitcoinClient from '../client/BitcoinClient';
import CoinbaseClient from '../client/CoinbaseClient';
import crypto from 'node:crypto';
import MerkleTree from '../util/MerkleTree';
import BlockUtil from '../util/BlockUtil';

dotenv.config();

let btcClient = new BitcoinClient();
let coinbaseClient = new CoinbaseClient();


test('Create Block Header', () => {
    let blockHeader = BlockUtil.createBlockHeader();
    console.log(blockHeader);
})


test('Create coinbase transaction', () => {
    let coinbaseTx = BlockUtil.createCoinbaseTransaction({
        version: 2,
        blockHeight: 1,
        value: 100n
    });
    expect(coinbaseTx).toBe(
        "02000000"+
        "00"+
        "0101000000000000000000000000000000000000000000000000000000000000"+
        "0000ffff"+
        "ff"+
        "ff03520101ffffffff0200f2052a0100000016001436e31c6bba78714ccad78eb6e6e47b0f97a2b8330000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000");
        // 020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff03510101ffffffff0200f2052a0100000016001436e31c6bba78714ccad78eb6e6e47b0f97a2b8330000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000
})

test('Create Block', () => {

    console.log(BlockUtil.createBlock());
})


test('Create transaction', () => {

    // Transaction version: 48
    const versionBuf = Buffer.alloc(4);
    versionBuf.writeUInt32LE(48);

    // Input Count: 0
    const inputCount = "00"

    // Output Count: 0
    const outputCount = "01"

    // Transaction Value: 100 sats
    const valueBuf = Buffer.alloc(8);
    valueBuf.writeBigInt64LE(100n);

    // Script hash to put a lock on transaction funds
    const sizeOfHash = "19";
    const scriptHash = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";

    // Lock time
    const lockTime = "00000000";
})

test('reverse bytes', () => {

    let buf = Buffer.alloc(32);
    buf.write('0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095', 'hex');

    expect(buf.reverse().toString('hex')).toBe(
        '9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000')

})