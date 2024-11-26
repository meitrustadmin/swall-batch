import Image from "next/image";
import localFont from "next/font/local";
import { SuiClient } from '@mysten/sui/client';
import { useEffect, useState } from "react";

const client = new SuiClient({
    url: 'https://rpc-testnet.suiscan.xyz:443',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {

    const [price, setPrice] = useState(0);

    useEffect(() => {
        async function getPrice() {
            // const price = await client.getObject({
            //     id: process.env.SUI_USD_PRICE_ORACLE_ID!,
            // });
            //console.log(process.env.SUI_USD_PRICE_ORACLE_ID!);
            // console.log(process.env.NEXT_PUBLIC_SUI_USD_PRICE_ORACLE_ID!);
            // let price: any = await client.getObject({
            //     id: '0xfc82dba201bebf2a2319d3e3dcfca920d1127e0352501c22b291a6b7d51484f0',
            //     options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            // })
            // console.log(price.data?.content?.fields.price);
            //setPrice(price.data?.content?.fields.price);
            //setPrice(price.data?.price);
        }
        getPrice();
    }, []);

  return (
    <div>
      <h1>Sui USD Price Oracle</h1>
    </div>
  );
}
