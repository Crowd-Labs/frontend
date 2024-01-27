import CreateCollection from "@/models/createcollection";
import { connectToDB } from "@/lib/mongodb";

export const POST = async (request) => {
    const { collectionName, collectionDesc, creator, logoImage, website, twitter, telegram, medium, discord, mintLimit, royalty, endTime, bCharge, mintPrice, currency, receiptAddress, bWhitelist, whitelistRootHash } = await request.json();
    try {
        await connectToDB();
        const collectionId = await CreateCollection.countDocuments({})
        const newCollection = new CreateCollection({ collectionName, collectionDesc, creator, collectionId: collectionId + 1, logoImage, website, twitter, telegram, medium, discord, mintLimit, royalty, endTime, bCharge, mintPrice, currency, receiptAddress, bWhitelist, whitelistRootHash });

        await newCollection.save();
        return new Response(JSON.stringify({message: "create collection successful."}), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({error: `Failed to create a new collection}), ${error}`}), { status: 500 });
    }
}