'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectionCards from "./collections";
import Nfts from "./nfts";
import { Divider } from "@/components/Footer";
import UserAvatar from "@/components/UserAvatar";
import { useAccount } from "wagmi";

const Profile = () => {
    
    const account = useAccount({
        onConnect: (data) => console.log('connected', data),
        onDisconnect: () => console.log('disconnected'),
      });

    return (
        <div>
            <UserAvatar className="rounded-sm w-28 h-28"/>
            <Tabs defaultValue="nft" className="mt-12">
                <TabsList className="bg-transparent text-xl text-white">
                    <TabsTrigger value="nft">My NFT</TabsTrigger>
                    <TabsTrigger value="collections">My Collection</TabsTrigger>
                </TabsList>
                <Divider />
                <TabsContent value="nft">
                    <Nfts accountAddress={account.address as string}/>
                </TabsContent>
                <TabsContent value="collections">
                    <CollectionCards accountAddress={account.address as string}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile