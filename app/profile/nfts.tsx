'use client'
import { getAllNFTByAccountAddress } from '@/api/thegraphApi';
import { NewNFTCreateds } from '@/lib/type';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { NFTCard } from '@/components/Collection/NFTCards';
import InscribeBtn from '@/components/Button/InscribeBtn';
import BitDialog from './dialog';

interface CollectionsProps {
    accountAddress: string;
}

const Nfts = (params: CollectionsProps) => {

    const { accountAddress } = params
    const [nfts, setNFTs] = useState<NewNFTCreateds[]>();
    useEffect(() => {
        getAllNFTByAccountAddress(accountAddress).then((res) => {
            setNFTs(res);
        });
    }, []);

    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-8'>
                {nfts?.map(card => (
                    <Link key={card.id} href={`/nft/${card?.collectionAddr}/${card?.tokenId}`}>
                        <NFTCard
                            src={card?.detailJson?.image}
                            className="mt-4"
                        >
                            <div className="h-11 flex items-center justify-between px-1 gap-2 text-white bg-green">
                                {card.detailJson.name && <div>{card.detailJson.name} #{card.tokenId}</div>}
                                <InscribeBtn data={card} onClick={(e) => { e.stopPropagation();e.preventDefault(); setOpen(true) }} />
                            </div>
                        </NFTCard>
                    </Link>
                ))}
            </div>
            <BitDialog open={open} onOpenChange={setOpen} onConfirm={() => {
                toast({ title: "coming soon..." })
            }} />
        </>

    )
}


export default Nfts 