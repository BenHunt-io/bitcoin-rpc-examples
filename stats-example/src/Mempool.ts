import crypto from 'crypto';
import BitcoinClient from './client/BitcoinClient';
import CoinbaseClient from './client/CoinbaseClient';
import dotenv from 'dotenv';
dotenv.config();

let btcClient = new BitcoinClient();
let coinbaseClient = new CoinbaseClient();

export async function getMaxMemPoolSizeMb() : Promise<number> {
    return btcClient.getMempoolInfo()
        .then(info => {
            let maxMemPoolBytes = info.maxmempool;
            return maxMemPoolBytes / 1_000_000;
    })
}

export async function getMemPoolUsageInMb() : Promise<number> {
    return btcClient.getMempoolInfo()
        .then(info => {
            let memPoolUsageBytes = info.usage;
            return memPoolUsageBytes / 1_000_000;
        })
}


// btcClient.getMempoolInfo()
//     .then(memPoolInfo => console.log(memPoolInfo));

// getMaxMemPoolSizeMb()
//     .then(maxMemPoolMb => console.log(`Max mempool: ${maxMemPoolMb}mb`));




getMemPoolUsageInMb()
    .then(memPoolUsageMb => console.log(`Mempoolusage: ${memPoolUsageMb}mb`))