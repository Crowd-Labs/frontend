import { CollectionInfo } from '@/lib/type';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Link href={`/collection/${collectionInfo.derivedCollectionAddr}`}>
      <Image src={collectionInfo.detailJson.image} alt={collectionInfo.name} className="object-fit w-full" />
    </Link>
  );
}

export default HotCollectionCard;
