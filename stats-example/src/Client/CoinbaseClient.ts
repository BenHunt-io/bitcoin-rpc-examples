
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export default class CoinbaseClient {

    static COINBASE_API_SECRET : string = process.env.COINBASE_API_SECRET!;
    static COINBASE_API_KEY : string = process.env.COINBASE_API_KEY!;

    getCoinbaseBitcoinPrice(){

        let accessTimestamp = Date.now() / 1000;
        let method = 'GET';
        let path = '/oracle';

        var message = accessTimestamp + method + path;

        let secret = Buffer.from(CoinbaseClient.COINBASE_API_SECRET, 'base64');
        let hmac = crypto.createHmac('sha256', secret);
        const signature = hmac.update(message).digest('base64'); 


        let request = {
            method : 'GET',
            headers : {
                Accept: 'application/json',
                'CB-ACCESS-KEY' : CoinbaseClient.COINBASE_API_KEY,
                'CB-ACCESS-SIGN' : signature,
                'CB-ACCESS-TIMESTAMP' : accessTimestamp.toString(),
                'CB-ACCESS-PASSPHRASE' : 'qxeyz4h0sk',
            }
        }


        return fetch('https://api.exchange.coinbase.com/oracle', request)
            .then(res => res.json())
            .then(res => res.prices.BTC);
    }

}