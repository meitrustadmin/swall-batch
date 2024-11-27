import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import axios from 'axios';
import { Transaction } from '@mysten/sui/transactions';

const SUI_MIST = 1000000000

const phrase = process.env.ADMIN_PHRASE;
const fullnode = process.env.FULLNODE!;
const keypair = Ed25519Keypair.fromSecretKey(phrase!);
const client = new SuiClient({
    url: fullnode,
});

const packageId = process.env.PACKAGE_ID;
const adminCap = process.env.ADMIN_CAP_ID!;
const suiUsdPriceOracleId = process.env.SUI_USD_PRICE_ORACLE_ID!;
const moduleName = 'sui_usd_price';

const getPrice = async (): Promise<number> => {
    const API_HOST2 = 'https://api.binance.com'
    try {
        const res = await axios.get(`${API_HOST2}/api/v3/ticker/price?symbol=SUIUSDT`);
        console.log(JSON.stringify(res.data))
        if (res.data) {
            console.log(res.data)
            console.log(res.data.price)
            return res.data.price
        }
        return 0;
    } catch (err) {
        console.log(err)
        return 0;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Cron job triggered");
        const price = await getPrice();
        if (price > 0) {
            const priceBigInt = price * SUI_MIST;
            const timestamp = Math.floor(Date.now() / 1000);
            console.log(priceBigInt);
            const transaction = new Transaction();
            transaction.setGasBudget(SUI_MIST / 10);
            transaction.moveCall({
                target: `${packageId}::${moduleName}::update_price`,
                arguments: [
                    transaction.object(adminCap), // AdminCap
                    transaction.object(suiUsdPriceOracleId), // SuiUsdPriceOracle
                    transaction.pure.u64(priceBigInt), // new_price
                    transaction.pure.u64(timestamp), // timestamp
                ],
            });
    
            const response = await client.signAndExecuteTransaction({
                signer: keypair,
                transaction,
            });
    
            console.log(response);
        }
        res.status(200).json({ message: "Job executed" });
    } catch (error) {
        console.error("Error executing cron job:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// import { SuiClient } from '@mysten/sui/client';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
// import { Transaction } from '@mysten/sui/transactions';
// import axios from 'axios';
// import * as dotenv from 'dotenv';

// dotenv.config({ path: '../.env' });

// const phrase = process.env.ADMIN_PHRASE;
// const fullnode = process.env.FULLNODE!;
// const keypair = Ed25519Keypair.deriveKeypair(phrase!);
// const client = new SuiClient({
//     url: fullnode,
// });

// const packageId = process.env.PACKAGE_ID;
// const adminCap = process.env.ADMIN_CAP_ID!;
// const suiUsdPriceOracleId = process.env.SUI_USD_PRICE_ORACLE_ID!;
// const moduleName = 'sui_usd_price';

// async function updateSuiUsdPrice() {
//     try {
//         const response = await axios.get('https://api.example.com/sui-usd-price');
//         const newPrice = response.data.price;
//         const timestamp = Math.floor(Date.now() / 1000);

//         let transaction = new Transaction();
//         transaction.moveCall({
//             target: `${packageId}::${moduleName}::update_price`,
//             arguments: [
//                 transaction.object(adminCap), // AdminCap
//                 transaction.object(suiUsdPriceOracleId), // SuiUsdPriceOracle
//                 transaction.pure(newPrice), // new_price
//                 transaction.pure(timestamp), // timestamp
//             ],
//         });

//         await client.signAndExecuteTransaction({
//             signer: keypair,
//             transaction,
//         });

//         console.log(`Updated SUI USD price to ${newPrice} at ${timestamp}`);
//     } catch (error) {
//         console.error('Failed to update SUI USD price:', error);
//     }
// }

// // Schedule the update to run every 10 minutes
// setInterval(updateSuiUsdPrice, 10 * 60 * 1000);