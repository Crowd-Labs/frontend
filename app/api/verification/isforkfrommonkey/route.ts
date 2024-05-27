import { client, queryAllNFTByAccountAddress } from "@/api/thegraphApi";
import { NewNFTCreateds } from "@/lib/type";

export const GET = async (request: Request) => {

    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    
    try {
        let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
            query: queryAllNFTByAccountAddress,
            variables: { accountAddress: params.Address }
        })
        const PacmanCollectionId = "0"
        // const isValid = !!response.data.newNFTCreateds?.some(nft => nft.collectionId == PacmanCollectionId)
        const object = response.data.newNFTCreateds?.find(nft => nft.collectionId == PacmanCollectionId)
        const res = object ? 0 : -1
        const timestamp = object ? object.blockTimestamp : null
        const txId = object ? object.transactionHash : null
        const result = {
            "Status": res,
            "Data": {
                "Timestamp": timestamp,
                "Tx": txId
            }
            // "result": {  // required on success
            //     isValid  // boolean, Whether the user completed the task.
            // }
        }
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), { status: 500 })
    }
} 