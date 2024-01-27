import CreateCollection from "@/models/createcollection";
import { connectToDB } from "@/lib/mongodb";

export const GET = async (request, {params}) => {
    try {
        await connectToDB()
        console.log('params',params)
        const collectionInfo = await CreateCollection.find(params)
        if (!collectionInfo) return new Response(JSON.stringify({error: "Collection Not Found"}), { status: 404 });
        return new Response(JSON.stringify(collectionInfo), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({error: `Internal Server Error, ${error}`}), { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { logoImage, website, twitter, telegram, medium, discord } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingCollection = await CreateCollection.findById(params.collectionId);

        if (!existingCollection) {
            return new Response("Collection not found", { status: 404 });
        }

        // Update the prompt with new data
        existingCollection.logoImage = logoImage;
        existingCollection.website = website;
        existingCollection.twitter = twitter;
        existingCollection.telegram = telegram;
        existingCollection.medium = medium;
        existingCollection.discord = discord;

        await existingCollection.save();

        return new Response("Successfully updated the CollectionInfo", { status: 200 });
    } catch (error) {
        return new Response("Error Updating CollectionInfo", { status: 500 });
    }
};

// export const DELETE = async (request, { params }) => {
//     try {
//         await connectToDB();

//         // Find the prompt by ID and remove it
//         await Prompt.findByIdAndRemove(params.id);

//         return new Response("Prompt deleted successfully", { status: 200 });
//     } catch (error) {
//         return new Response("Error deleting prompt", { status: 500 });
//     }
// };