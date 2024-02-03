'use client';

import React from "react"
import BuyButton from '@/components/Button/BuyBtn';
import ForkButton from '@/components/Button/ForkBtn';
import Link from 'next/link';
import DeleteBtn from '@/components/Button/DeleteBtn';
import { NFTCard } from '@/components/Collection/NFTCards';
import { cn } from '@/lib/utils';
import { CollectionInfo, NewNFTCreateds } from '@/lib/type';
import { useRouter } from "next/navigation";

function Collections(props: {
  data: NewNFTCreateds[];
  collectionItem: CollectionInfo | undefined;
  className?: string;
}) {
  const { data = [], className, ...rest } = props;
  return (
    <div className={cn('grid grid-cols-4 gap-4 py-8', className)}>
      {data.map((card) => (
        <CollectionCard data={card} {...rest} key={card.id} />
      ))}
    </div>
  );
}

export function CollectionCard(props: {
  data: NewNFTCreateds;
  collectionItem?: CollectionInfo;
  children?: React.ReactNode;
  [index: string]: any;
}) {
  const { data: card, collectionItem, ...rest } = props;
  const router = useRouter()
  return (
    <div key={card.id} className="cursor-pointer" onClick={() => {
      router.push(`/nft/${card.collectionAddr}/${card.tokenId}`)
    }}>
      <NFTCard src={card?.detailJson.image} {...rest}>
        <>
          <div className="absolute right-2 top-2">
            <DeleteBtn data={card} owner={collectionItem?.collectionOwner} />
          </div>
          <div className="h-11 flex items-center justify-between px-2 gap-2 text-white bg-green">
            {card.tokenId && <div>{`#${card.tokenId}`}</div>}
            <ForkButton data={card} />
            <BuyButton
              data={{
                ...card,
                derivedCollectionAddr: collectionItem?.derivedCollectionAddr,
              }}
            />
            {props.children}
          </div>
        </>
      </NFTCard>
    </div>
  );
}

export default Collections;
