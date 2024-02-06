'use client'
import { getAllCollectionInfo } from '@/api/thegraphApi';
import BuyButton from '@/components/Button/BuyBtn';
import { CollectionDone } from '@/components/Collection/CollectionCards';
import { CollectionInfo } from '@/lib/type';

import { useEffect, useState } from 'react';


const Collections = () => {
    const [collections, setCollections] = useState<CollectionInfo[]>([])
    useEffect(() => {
        getAllCollectionInfo().then(res => {
            setCollections(res as CollectionInfo[])
        })
    }, [])

    return (
        <div className='grid grid-cols-4 gap-x-4 gap-y-8 py-4'>
            {collections?.map(card => (
                <CollectionDone sampleData={card} key={card.collectionId}>
                    <div className="absolute w-full bottom-0 h-11 flex items-center justify-between bg-green px-2 text-white gap-2">
                        <div>{card.name}</div>
                        <BuyButton data={card as any} />
                    </div>
                </CollectionDone>
            ))}
        </div>
    )
}


export default Collections 