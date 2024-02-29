import { CollectionInfo } from '@/lib/type';
import Link from 'next/link';
import Image from '@/components/Image';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Link href={`/collection/${collectionInfo.derivedCollectionAddr}`} className='relative block group rounded-sm overflow-hidden h-full'>
      <Image src={collectionInfo.detailJson?.image} alt={collectionInfo.name} className="object-fit w-full h-full opacity-90 image-rendering-pixelated" />
      <div className='hidden group-hover:block absolute bottom-0 w-full text-white p-2'>
        <div className='text-base'>{collectionInfo.name}</div>
        <div className='text-xs'>HOT COLLECTION</div>
      </div>
    </Link>
  );
}

export default HotCollectionCard;
