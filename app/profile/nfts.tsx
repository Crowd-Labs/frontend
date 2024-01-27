'use client'
import { getAllNFT } from '@/api/thegraphApi';
import { CollectionInfoData, DefaultNFTS } from '@/constants';
import {  NewNFTCreateds } from '@/lib/type';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CollectionCard } from '../collection/[id]/collections';

// const fakeData=Array.from({length:5}).fill(1).map(i=>CollectionInfoData)

const Collections = () => {

    const [nfts, setNFTs] = useState<NewNFTCreateds[]>();
    useEffect(() => {
        getAllNFT().then((res) => {
            console.log('res', res);
            setNFTs(res);
        });
    }, []);

    return (
        <div className='grid grid-cols-4 gap-4 py-8'>
            {nfts?.map(card => (
                <Link key={card.id} href={`/collection/${card?.collectionId}`}>
                    <CollectionCard
                        data={card}
                        className="mt-4"
                    />
                </Link>
            ))}
        </div>
    )
}


export default Collections 