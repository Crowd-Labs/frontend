import { CollectionInfo } from '@/lib/type';
import Image, { StaticImageData } from 'next/image';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Image src={collectionInfo.detailJson.image} alt={collectionInfo.name} className="object-fit w-full" />
  );
}

export default HotCollectionCard;
