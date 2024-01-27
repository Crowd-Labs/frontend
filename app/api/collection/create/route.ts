import CreateCollection from "@/models/createcollection";
import { connectToDB } from "@/lib/mongodb";
import { calNextCollectionContractAddr } from "@/lib/utils";
import { DERIVED_NFTIMPL_ADDRESS } from "@/constants";
import { ethers } from "ethers";


export const POST = async (request) => {
    const { collectionName, collectionDesc, creator, logoImage, website, twitter, telegram, medium, discord, mintLimit, royalty, endTime, bCharge, mintPrice, currency, receiptAddress, bWhitelist, whitelistRootHash } = await request.json();
    try {
        await connectToDB();
        const collectionId = await CreateCollection.countDocuments({})
        const collectionAddress = calNextCollectionContractAddr(DERIVED_NFTIMPL_ADDRESS, ethers.solidityPackedKeccak256(["uint256"], [collectionId]));
        const newCollection = new CreateCollection({ collectionId: collectionId, collectionAddress, collectionName, collectionDesc, creator, logoImage, website, twitter, telegram, medium, discord, mintLimit, royalty, endTime, bCharge, mintPrice, currency, receiptAddress, bWhitelist, whitelistRootHash });

        await newCollection.save();
        return new Response(JSON.stringify({message: {collectionAddress}}), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({error: `Failed to create a new collection}), ${error}`}), { status: 500 });
    }
}