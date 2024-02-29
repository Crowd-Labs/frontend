import { client, queryAllNFTByAccountAddress } from "@/api/thegraphApi";
import { NewNFTCreateds } from "@/lib/type";

export const GET = async (request: Request) => {

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    
    try {
        let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
            query: queryAllNFTByAccountAddress,
            variables: { accountAddress: params.address }
        })
        const MonkeyCollectionId = "0"
        const isValid = !!response.data.newNFTCreateds?.some(nft => nft.collectionId == MonkeyCollectionId)
        const result = {
            "result": {  // required on success
                isValid  // boolean, Whether the user completed the task.
            }
        }
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), { status: 500 })
    }
} 