'use client'
import { getAllNFTByAccountAddress } from '@/api/thegraphApi';
import { NewNFTCreateds } from '@/lib/type';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NFTCard } from '@/components/Collection/NFTCards';
import InscribeBtn from '@/components/Button/InscribeBtn';

interface CollectionsProps {
    accountAddress: string;
}

const Nfts = (params : CollectionsProps) => {

    const { accountAddress } = params
    const [nfts, setNFTs] = useState<NewNFTCreateds[]>();
    useEffect(() => {
        getAllNFTByAccountAddress(accountAddress).then((res) => {
            console.log('res', res);
            setNFTs(res);
        });
    }, []);

    return (
        <div className='grid grid-cols-4 gap-4 py-8'>
            {nfts?.map(card => (
                <Link key={card.id} href={`/collection/${card?.collectionAddr}`}>
                    <NFTCard
                        src={card?.detailJson.image}
                        className="mt-4"
                    >
                        <div className="h-11 flex items-center justify-between px-2 gap-2 text-white bg-green">
                            {card.detailJson.name && <div>{card.detailJson.name}</div>}
                            <InscribeBtn data={card} />
                        </div>
                    </NFTCard>
                </Link>
            ))}
        </div>
    )
}


export default Nfts 