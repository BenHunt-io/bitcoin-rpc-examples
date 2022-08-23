import crypto from 'crypto';
import BitcoinClient from './client/BitcoinClient';
import CoinbaseClient from './client/CoinbaseClient';
import dotenv from 'dotenv';
dotenv.config();

let btcClient = new BitcoinClient();
let coinbaseClient = new CoinbaseClient();


async function transactionExample(walletName : string){

    // let walletResponse = await btcClient.createWallet(walletName);
    let loadWalletResponse = await btcClient.loadWallet(walletName);
    let bobAddress = await btcClient.getNewAddress();
    // let aliceAddress = await btcClient.getNewAddress();

    console.log(bobAddress);
    // // console.log(aliceAddress);

    // let block = await btcClient.generateBlock({outputAddress : bobAddress, transactions : []});

    // btcClient.getBalance({})
    //     .then(balance => console.log(`Balance: ${balance}`));


}


// transactionExample("wallet-41");

