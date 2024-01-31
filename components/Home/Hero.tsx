import Link from 'next/link';
import { BRCROWD_DOC, YIELD_AND_GASREWARD } from '@/constants';
import { Button } from '../ui/button';
import HotCollectionCard from '../HotCollectionCard';
import { CollectionInfo } from '@/lib/type';
import { useEffect, useState } from 'react';
import { getAllCollectionInfo, getAllCreators } from '@/api/thegraphApi';
import { formatNumber, shuffleArray } from '@/lib/utils';
import { Address, useContractRead } from 'wagmi';
import { YIELD_AND_GASREWARD_ABI } from '@/abis/BeCrowdProxy';
import { toAmount } from '@/lib/utils';
import BigNumber from 'bignumber.js';

function Hero() {

  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  useEffect(() => {
    getAllCollectionInfo().then((res) => {
      console.log("res", res);
      setCollections(res);
    });
  }, []);

  let randomCollections = shuffleArray<CollectionInfo>(collections);
  if (randomCollections.length > 5) {
    randomCollections = randomCollections.slice(0, 5)
  }

  const [creatorsNum, setCreatorsNum] = useState<number>()
  useEffect(() => {
    getAllCreators().then(res => {
      setCreatorsNum(res)
    })
  }, [])

  const { data: currentTVL } = useContractRead({
    address: YIELD_AND_GASREWARD as Address,
    abi: YIELD_AND_GASREWARD_ABI,
    functionName: 'currentStakeEthAmount',
  });

  const { data: currentYield } = useContractRead({
    address: YIELD_AND_GASREWARD as Address,
    abi: YIELD_AND_GASREWARD_ABI,
    functionName: 'totalYieldAndGasReward',
  });

  return (
    <section className="w-full flex flex-col justify-center gap-10">
      <div className="relative flex-center flex-col w-full pt-28 gap-6">
        <h1 className="h1-heading items-center"> Like-minded people makes you idea great.</h1>
        <div className=" relative flex-center flex-col gap-2">
          <p className="p-content">A decentralized co-creation platform where you only need an idea, set the rules,</p>
          <p className="p-content">The community will make it come true.</p>
        </div>
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
      <div className="flex-center mt-10 gap-32 text-white text-2xl">
        <div>Current Yield:<span className='text-egg'> {`${toAmount(
          (currentYield as BigNumber.Value) || 0,
          18,
        )} ETH`}</span></div>
        <div>TVL:<span className='text-egg'>{`${toAmount(
          (currentTVL as BigNumber.Value) || 0,
          18,
        )} ETH`}</span></div>
        <div>Creators: <span className='text-egg'>{formatNumber(creatorsNum)}</span></div>
      </div>
      <div className="mt-16 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-between relative">
        {randomCollections.map((coll) => (
          <HotCollectionCard key={coll.collectionId} {...coll} />
        ))}
      </div>
    </section>
  );
}

export default Hero;
