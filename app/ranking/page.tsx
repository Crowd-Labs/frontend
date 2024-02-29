"use client"

import TopNFTCreator from './components/TopNFTCreator';
import TopParticipatingCreator from './components/TopParticipatingCreator';
import { Divider } from '@/components/Footer';

function Ranking() {

  return (
    <div>
      <Divider />
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-4 gap-y-8 mt-20">
        <TopNFTCreator />
        <TopParticipatingCreator />
      </div>
    </div>
  );
}

export default Ranking;
