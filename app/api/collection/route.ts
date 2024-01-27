import CreateCollection from "@/models/createcollection";
import { connectToDB } from "@/lib/mongodb";

export const GET = async (request: Request) => {

    const { searchParams } = new URL(request.url)
    const params=Object.fromEntries(searchParams)

    try {
        await connectToDB()

        const collections = await CreateCollection.find(params)

        return new Response(JSON.stringify(collections), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), { status: 500 })
    }
} 