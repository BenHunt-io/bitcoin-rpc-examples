import dotenv from 'dotenv';
import BitcoinClient from '../client/BitcoinClient';
import CoinbaseClient from '../client/CoinbaseClient';
dotenv.config();

let btcClient = new BitcoinClient();
let coinbaseClient = new CoinbaseClient();

test("create wallet", async () => {
   let wallet = await btcClient.createWallet("bobswallet")
})

test("generate address", async () => {
    let newAddr = await btcClient.getNewAddress()
    console.log(newAddr);
})

// Newly mined blocks require 100 more blocks for the coins to be spendable.
test("generate 100 blocks", async () => {
    for(let i = 0; i<100; i++){
        await btcClient.generateBlock({outputAddress : "bcrt1q0qfyrgp7kryhss0t9d0qntmy4kyaclyyj6wweh", transactions: []});
    }
})

test("generate (mine) block to wallet address", async () => {
    btcClient.generateBlock({outputAddress : "someAddress", transactions: []})
        .then(block => console.log(block));
})

test("generate (mine) block to wallet address", async () => {
    btcClient.getBalance({})
        .then(bal => console.log(bal));
})
