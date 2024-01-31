'use client'
import { getAllCollectionInfo } from '@/api/thegraphApi';
import BuyButton from '@/components/Button/BuyBtn';
import { CollectionDone } from '@/components/Collection/CollectionCards';
import { CollectionInfo } from '@/lib/type';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Collections = () => {
    const [collections, setCollections] = useState<CollectionInfo[]>([])
    useEffect(()=>{
        getAllCollectionInfo().then(res=>{
            setCollections(res as CollectionInfo[])
        })
    }, [])
    return (
        <div className='grid grid-cols-4 gap-4 py-8'>
            {collections?.map(card => (
                <Link key={card.collectionId} href={`/collection/${card?.derivedCollectionAddr}`}>
                    <CollectionDone sampleData={card} >
                        <div className="absolute w-full bottom-0 h-11 flex items-center justify-between bg-green px-2 text-white gap-2">
                            <div>{card.name}</div>
                            <BuyButton data={card as any} />
                        </div>
                    </CollectionDone>
                </Link>
            ))}
        </div>
    )
}


export default Collections 