import crypto from 'crypto';
import BitcoinClient from './client/BitcoinClient';
import CoinbaseClient from './client/CoinbaseClient';
import dotenv from 'dotenv';
dotenv.config();

let btcClient = new BitcoinClient();
let coinbaseClient = new CoinbaseClient();

// HTTP Client

async function findMaxTxSizeForLatestBlock(){

    let blockCount = await btcClient.findBlockCount();
    let maxTxSize = await btcClient.findMaxTxSize(blockCount);

}

async function findMaxFeeForLatestBlock(){

    let blockCount = await btcClient.findBlockCount();
    let maxFeeInSats : number = await btcClient.findMaxFee(blockCount);
    let btcPriceUSD = await coinbaseClient.getCoinbaseBitcoinPrice();

    const numStatsPerBtc = 100_000_000;

    let maxFeeInUSD = (maxFeeInSats/numStatsPerBtc) * btcPriceUSD;

    return maxFeeInUSD;

}

// findMaxFee()
//     .then(maxFeeInUSD => console.log(`Max Fee in USD: ${maxFeeInUSD}`));

// btcClient.findMaxTxSize(100_000)
//     .then(maxTxSize => console.log(`Max Transaction Size : ${maxTxSize} Bytes`));


/**
 * Decide which set of examples to run by dynamically importing that file
 */

import('./Wallet')

