import { LaunchPadCollections } from '@/constants';
import LaunchpadCard from '../Collection/LaunchpadCard';
import { getUnFinishCollection } from '@/api/thegraphApi';
import { CollectionInfo } from '@/lib/type';
import { useState, useEffect } from 'react';

function Launchpad() {
  const [collections, setCollections] = useState<CollectionInfo[]>([])

  useEffect(() => {
    const todaySecondStr = `${Math.floor(Date.now() / 1000)}`;
    getUnFinishCollection(todaySecondStr).then((res) => setCollections(res));
  }, []);

  return (
    <section className="mt-20">
      <div className="h1-heading">
        Launchpad drops
      </div>
      <div className="mt-12 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {collections.map((card) => (
          <LaunchpadCard sampleData={card} key={card.id} />
        ))}
      </div>
    </section>
  );
}

export default Launchpad;
