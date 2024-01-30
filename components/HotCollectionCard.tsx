import { CollectionInfo } from '@/lib/type';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Link href={`/collection/${collectionInfo.derivedCollectionAddr}`} className='relative'>
      <Image src={collectionInfo.detailJson?.image} alt={collectionInfo.name} className="object-fit w-full h-full" fill={true} />
    </Link>
  );
}

export default HotCollectionCard;
