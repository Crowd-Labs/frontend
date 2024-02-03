import { CollectionInfo } from '@/lib/type';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Link href={`/collection/${collectionInfo.derivedCollectionAddr}`} className='relative block h-64 group rounded-sm overflow-hidden'>
      <Image src={collectionInfo.detailJson?.image} alt={collectionInfo.name} className="object-fit w-full h-full opacity-90" width={256} height={256} />
      <div className='hidden group-hover:block absolute bottom-0 w-full text-white p-2'>
        <div className='text-base'>{collectionInfo.name}</div>
        <div className='text-xs'>HOT COLLECTION</div>
      </div>
    </Link>
  );
}

export default HotCollectionCard;
