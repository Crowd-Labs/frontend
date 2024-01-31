import { CollectionInfo } from '@/lib/type';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

function HotCollectionCard(collectionInfo: CollectionInfo) {
  return (
    <Link href={`/collection/${collectionInfo.derivedCollectionAddr}`} className='relative block h-64'>
      <Image src={collectionInfo.detailJson?.image} alt={collectionInfo.name} className="object-fit w-full h-full" width={256} height={256} />
    </Link>
  );
}

export default HotCollectionCard;
