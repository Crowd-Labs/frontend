import Link from 'next/link';
import { LEARN_ADDRESS, YIELD_AND_GASREWARD } from '@/constants';
import { Button } from '../ui/button';
import HotCollectionCard from '../HotCollectionCard';
import { CollectionInfo, ProjectInfo } from '@/lib/type';
import { useEffect, useState } from 'react';
import { getAllCollectionInfo, getAllCreators, getProjectInfo } from '@/api/thegraphApi';
import { formatNumber, shuffleArray } from '@/lib/utils';
import { Address, useContractRead } from 'wagmi';
import { YIELD_AND_GASREWARD_ABI } from '@/abis/BeCrowdProxy';
import { toAmount } from '@/lib/utils';
import BigNumber from 'bignumber.js';

function Hero() {

  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  useEffect(() => {
    getAllCollectionInfo().then((res) => {
      setCollections(res);
    });
  }, []);

  let randomCollections = collections;
  if (randomCollections.length > 5) {
    randomCollections = randomCollections.slice(0, 5)
  }

  // const [creatorsNum, setCreatorsNum] = useState<number>()
  // useEffect(() => {
  //   getAllCreators().then(res => {
  //     setCreatorsNum(res)
  //   })
  // }, [])

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>()

  useEffect(() => {
    getProjectInfo().then(res => {
      setProjectInfo(res)
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
      <div className="relative flex-center flex-col w-full pt-20 gap-6">
        <h1 className="h1-heading items-center"> Like-minded people makes you idea great.</h1>
        <div className=" relative flex-center flex-col gap-2">
          <p className="p-content">A decentralized co-creation platform where you only need an idea, set the rules,</p>
          <p className="p-content">The community will make it come true.</p>
        </div>
      </div>
      <div className="relative flex-center gap-20">
        <Button
          variant="yellow"
        >
          <Link href="/collection/create">Get Started</Link>
        </Button>
        <Button
          variant="yellow"
        >
          <Link target="_blank" href={LEARN_ADDRESS}>View Tutorial</Link>
        </Button>
      </div>
      <div className="flex-center mt-4 lg:gap-32 gap-2 text-white text-2xl flex-wrap">
        <div>Current Yield:<span className='text-egg'> {`${toAmount(
          (currentYield as BigNumber.Value) || 0,
          18, 10
        )} ETH`}</span></div>
        <div>TVL:<span className='text-egg'>{`${toAmount(
          (currentTVL as BigNumber.Value) || 0,
          18, 4
        )} ETH`}</span></div>
      </div>

      <div className="flex-center lg:gap-32 gap-2 text-white text-xl flex-wrap">
        <div>Creators: <span className='text-egg'>{formatNumber(projectInfo?.creatorsNum)}</span></div>
        <div>Collections: <span className='text-egg'>{formatNumber(projectInfo?.totalCollectioinNum)}</span>
        </div>
        <div>NFTs: <span className='text-egg'>{formatNumber(projectInfo?.totalNFTNum)}</span></div>
        <div>Txs: <span className='text-egg'>{formatNumber(projectInfo?.totalTx)}</span></div>
      </div>

      <div className="mt-2 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-between relative">
        {randomCollections.length === 0 && <div className='h-[208px]' id="holder"></div>}
        {randomCollections.map((coll) => (
          <HotCollectionCard key={coll.collectionId} {...coll} />
        ))}
      </div>
    </section>
  );
}

export default Hero;
