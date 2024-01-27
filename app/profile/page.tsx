import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectionCards from "./collections";
import Nfts from "./nfts";
import { Divider } from "@/components/Footer";
import UserAvatar from "@/components/UserAvatar";

const Profile = () => {
    return (
        <div>
            <UserAvatar className="rounded-sm w-28 h-28"/>
            <Tabs defaultValue="collections" className="mt-12">
                <TabsList className="bg-transparent text-xl text-white">
                    <TabsTrigger value="collections">My Collection</TabsTrigger>
                    <TabsTrigger value="nft">My NFT</TabsTrigger>
                </TabsList>
                <Divider />
                <TabsContent value="collections">
                    <CollectionCards />
                </TabsContent>
                <TabsContent value="nft">
                    <Nfts />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile