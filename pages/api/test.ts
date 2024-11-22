import { NextApiRequest } from "next";
import { NextApiResponse } from "next";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Cron job triggered");
    // Your logic here
    res.status(200).json({ message: "Job executed" });
}