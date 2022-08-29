/**
 * Sets up data in the local regtest blockchain
 */
import BitcoinClient from "../client/BitcoinClient";
import  crypto  from "node:crypto";


test("Setup two wallets and make payment", async () => {

    let btcClient = new BitcoinClient();

    // Create Wallets
    let bensWallet = await btcClient.createWallet(`bens-wallet-${crypto.randomUUID()}`);
    let bensWalletAddr = await btcClient.getNewAddress(bensWallet.name);
    let tomsWallet = await btcClient.createWallet(`toms-wallet-${crypto.randomUUID()}`);
    let tomsWalletAddr = await btcClient.getNewAddress(tomsWallet.name);

    // Mine block rewards to wallet. Takes 100 blocks for blockrewards to mature.
    let spendableTxs = [];
    for(let i = 0; i<110; i++){
        let genBlockResult = await btcClient.generateBlock({outputAddress: bensWalletAddr, transactions: []});
        
        // These 10 transactions will be spendable after 100 blocks have been added ahead of them.
        if(i < 10){
            let blockInfo = await btcClient.getBlock(genBlockResult.hash);
            spendableTxs.push(blockInfo.tx[0]);
        }
    }

    console.log(`Spendable transactions: ${spendableTxs}`);

    let sendTxResponse = await btcClient.send(bensWallet.name, {
        recipientAddresses: [{[tomsWalletAddr]: 0.01}],
        confirmationTarget: null,
        estimateMode: null,
        feeRate: 25 
    })


    let genBlockResult = await btcClient.generateBlock({outputAddress: bensWalletAddr, transactions: [sendTxResponse.txid]});


    let tomsBalance = await btcClient.getBalance(tomsWallet.name, {});

    console.log(`Bens Wallet Adress: ${bensWalletAddr}`);
    console.log(`Toms Wallet Adress: ${tomsWalletAddr}`);
    console.log(`Bens Wallet Name: ${bensWallet.name}`);
    console.log(`Toms Wallet Name: ${tomsWallet.name}`);

    let hexEncodedBlock = await btcClient.getBlock(genBlockResult.hash, 0);

    console.log(`Block data: ${hexEncodedBlock}`);

    expect(tomsBalance).toBe(0.01);

}, 20_000);