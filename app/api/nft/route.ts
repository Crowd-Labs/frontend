import ForkNFT from "@/models/mintnft";
import { connectToDB } from "@/lib/mongodb";

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    // console.log(params);
    
    try {
        await connectToDB()

        const nfts = await ForkNFT.find(params)

        return new Response(JSON.stringify(nfts), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch nfts" }), { status: 500 })
    }
} 