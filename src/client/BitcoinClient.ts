import dotenv from 'dotenv';
dotenv.config();


export default class BitcoinClient {

    static BITCOIN_NODE_URL : string = process.env.BITCOIN_NODE_URL!;


    private createRequest(method : string, params : any[]) : RequestInit {

        let [BITCOIN_NODE_USER, BITCOIN_NODE_PASSWORD] : string[] = [process.env.BITCOIN_NODE_USER!, process.env.BITCOIN_NODE_PASSWORD!];
        let credentials = Buffer.from(`${BITCOIN_NODE_USER}:${BITCOIN_NODE_PASSWORD}`).toString('base64');

        let req = {
            method : 'POST',
            headers: {
                Authorization : `Basic ${credentials}`,
                'Content-Type' : "application/json;charset=utf8"
            },
            body: JSON.stringify({
                jsonrpc: 2.0,
                method: method,
                params: params,
                id: 'getblock.io'
            })
        }
        
        return req;
        
    }

    /**
     * General Blockchain RPC's
     */

    getBlock(blockHash: string, verbosity: number = 1){
        let request = this.createRequest('getblock', [blockHash, verbosity]);

        return fetch(BitcoinClient.BITCOIN_NODE_URL, request)
            .then(res => res.json())
            .then(res => res.result);
    
    }

    findMaxTxSize(blockHeight: number) : Promise<number> {

        let request = this.createRequest('getblockstats', [blockHeight, ['maxtxsize']]);

        return fetch(BitcoinClient.BITCOIN_NODE_URL, request)
            .then(res => res.json())
            .then(res => res.result.maxtxsize);
        
    }

    findMaxFee(blockHeight: number) : Promise<number> {

        let request = this.createRequest('getblockstats', [blockHeight, ['maxfee']]);

        return fetch(BitcoinClient.BITCOIN_NODE_URL, request)
            .then(res => res.json())
            .then(res => res.result.maxtxsize);
    }

    findStat(blockHeight: number, stat: string) : Promise<number> {

        let request = this.createRequest('getblockstats', [blockHeight, [stat]]);

        return fetch(BitcoinClient.BITCOIN_NODE_URL, request)
            .then(res => res.json())
            .then(res => res.result[stat]);
    }

    findBlockCount(){
        return fetch(process.env.BITCOIN_NODE_URL!, {
            method : 'POST',
            headers: {
                // 'x-api-key' : GETBLOCK_API_KEY,
                Authorization: 'Basic YmVuamk6dGVzdA==',
                'Content-Type' : "application/json;charset=utf8"
            },
            body: JSON.stringify({
                jsonrpc: 2.0,
                method: 'getblockcount',
                params: [],
                id: 'getblock.io'
            })
        })
        .then(res => res.json())
        .then(res => res.result);
    }

    getMempoolInfo(){

        let request = this.createRequest('getmempoolinfo', []);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => res.result);
    }


    /**
     * 
     * Wallet RPC's
     * 
     */

    createWallet(name : string){

        let request = this.createRequest('createwallet', [name]);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => {
                return res.result;
            });

    }

    getNewAddress(walletName : string){
        let request = this.createRequest('getnewaddress', []);

        return fetch(`${process.env.BITCOIN_NODE_URL!}/wallet/${walletName}`, request)
            .then(res => res.json())
            .then(res => res.result);
    }


    /**
     * Directory of wallet relative to /home/bitcoin/.bitcoin/regtest/wallets within the container
     * Regtest if the node is a regtest node.
     * @param walletPath 
     * @returns 
     */
    loadWallet(walletPath : string){
        let request = this.createRequest('loadwallet', [walletPath]);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                return res.result;
            });
    }

    unloadWallet(walletName: string){
        let request = this.createRequest('unloadwallet', [walletName]);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                return res.result;
            });
    }

    listWalletDir(){
        let request = this.createRequest('listwalletdir', []);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => res.result);
    }

    getBalance(walletName : string, args : {minConf? : string, includeWatchOnly? : boolean, avoidReuse? : boolean}){

        // Filters out falsy values
        let truthyArgs  = Object.values(args)
            .filter(Boolean);

        let request = this.createRequest('getbalance', truthyArgs);

        return fetch(`${process.env.BITCOIN_NODE_URL!}/wallet/${walletName}`, request)
            .then(res => res.json())
            .then(res => res.result);
    }

    sendToAddress(args : {address : string, amount : number, comment? : string, commentTo? : string,
        subtractFeeFromAmount? : boolean, replaceable? : boolean, confTarget? : number,
        estimateMode? : string, avoidReuse?: boolean}){

            // Filters out falsy values
            let truthyArgs  = Object.values(args)
                .filter(Boolean);

            console.log(truthyArgs);

            let request = this.createRequest('sendtoaddress', truthyArgs);

            return fetch(process.env.BITCOIN_NODE_URL!, request)
                .then(res => res.json())
                .then(res => res.result);
    }

    send(fromWalletName: string, {recipientAddresses, confirmationTarget=null, estimateMode=null, feeRate} : {recipientAddresses : any[], 
        confirmationTarget : number | null, estimateMode : string | null, feeRate : number | null}){

            let request = this.createRequest('send', [recipientAddresses, confirmationTarget, estimateMode, feeRate]);

            return fetch(`${process.env.BITCOIN_NODE_URL!}/wallet/${fromWalletName}`, request)
                .then(res => res.json())
                .then(res => res.result);
    }


    /**
     * Generating RPC's. Use this to mint new bitcoin
     */


    generateBlock({outputAddress, transactions}: {outputAddress: string, transactions: string[]}){

        let request = this.createRequest('generateblock', [outputAddress, transactions]);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => res.result);

    }

    /**
     * Mining RPCs
     */

    submitBlock(blockHexEncoded : string){
        let request = this.createRequest('submitblock', [blockHexEncoded]);

        return fetch(process.env.BITCOIN_NODE_URL!, request)
            .then(res => res.json())
            .then(res => res.result);
    }


}