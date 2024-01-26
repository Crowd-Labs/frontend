import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollectionProps } from "./CollectionCards";
import { NewCollectionCreateds, NFTInfoProps } from "@/lib/type";
import { getShortAddress } from "@/lib/utils";

const UserAvatar = (props: {
  data?: NFTInfoProps;
  created?: {detailJson:{image: string}, collectionOwner?: string};
  className?: string;
}) => {
  const { data, created, className = "w-10 h-10" } = props;
  let logo;
  // if (data){
  //     logo = data.nftName
  // }else{
  //     logo = created?.detailJson.image
  // }
  // NFT doesn't has a logo
  logo = created?.detailJson.image;
  return (
    <div className="flex gap-2 items-center">
      <Avatar className={className}>
        <AvatarImage src={logo as string} />
        <AvatarFallback>{created?.collectionOwner}</AvatarFallback>
      </Avatar>
      <div>{getShortAddress(created?.collectionOwner || '')}</div>
    </div>
  );
};

export default UserAvatar;
