'use client'
import { getAllNFT } from '@/api/thegraphApi';
import {  NewNFTCreateds } from '@/lib/type';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CollectionCard } from '../collection/[collectionaddress]/collections';

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
                <Link key={card.id} href={`/collection/${card?.collectionAddr}`}>
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