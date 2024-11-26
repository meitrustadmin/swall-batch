import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { NextApiRequest, NextApiResponse } from "next";

const SUI_MIST = 1000000000

const phrase = process.env.ADMIN_PHRASE;
const fullnode = process.env.FULLNODE!;
const keypair = Ed25519Keypair.fromSecretKey(phrase!);
const client = new SuiClient({
    url: fullnode,
});

const packageId = process.env.PACKAGE_ID;
const suiUsdPriceOracleId = process.env.SUI_USD_PRICE_ORACLE_ID!;
const moduleName = 'sui_usd_price';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Cron job triggered");

        const transaction = new Transaction();
        transaction.setGasBudget(SUI_MIST / 10);
        transaction.moveCall({
            target: `${packageId}::${moduleName}::get_price`,
            arguments: [
                transaction.object(suiUsdPriceOracleId), // SuiUsdPriceOracle
            ],
        });

        const response = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction,
        });

        console.log(response);

        res.status(200).json({ message: "Job executed" });
    } catch (error) {
        console.error("Error executing cron job:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}