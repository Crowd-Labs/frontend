import Link from 'next/link';
import { BRCROWD_DOC } from '@/constants';
import { Button } from '../ui/button';
import HotCollectionCard from '../HotCollectionCard';
import { CollectionInfo } from '@/lib/type';
import { useEffect, useState } from 'react';
import { getAllCollectionInfo } from '@/api/thegraphApi';
import { shuffleArray } from '@/lib/utils';

function Hero() {

  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  useEffect(() => {
    getAllCollectionInfo().then((res) => {
      console.log("res", res);
      setCollections(res);
    });
  }, []);
  
  let randomCollections = shuffleArray<CollectionInfo>(collections);
  if(randomCollections.length > 5){
    randomCollections = randomCollections.slice(0, 5)
  }

  return (
    <section className="w-full flex flex-col justify-center gap-10">
      <div className=" relative flex-center flex-col w-full pt-32 gap-2">
        <h1 className="h1-heading items-center"> Like-minded people makes you idea great.</h1>
        <p className="p-content">A decentralized co-creation platform where you only need an idea, set the rules,</p>
        <p className="p-content">The community will make it come true.</p>
      </div>
      <div className="relative flex-center gap-20">
        <Button
          asChild
          variant="yellow"
        >
          <Link href="/collection/create">Get Started</Link>
        </Button>
        <Button
          asChild
          variant="yellow"
        >
          <Link target="_blank" href={BRCROWD_DOC}>Read the doc</Link>
        </Button>
      </div>
      <div className=" mt-16 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-between">
        {randomCollections.map((coll) => (
          <HotCollectionCard key={coll.collectionId} {...coll} />
        ))}
      </div>
    </section>
  );
}

export default Hero;
