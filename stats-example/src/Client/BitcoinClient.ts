import dotenv from 'dotenv';
dotenv.config();


export default class BitcoinClient {

    static BITCOIN_NODE_URL : string = process.env.BITCOIN_NODE_URL!;


    private createRequest(method : string, params : any[]) : RequestInit {

        let [AUTH_HEADER_KEY, AUTH_HEADER_VALUE] : string[] = [process.env.AUTH_HEADER_KEY!, process.env.AUTH_HEADER_VALUE!];

        let req = {
            method : 'POST',
            headers: {
                [AUTH_HEADER_KEY] : AUTH_HEADER_VALUE,
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


}