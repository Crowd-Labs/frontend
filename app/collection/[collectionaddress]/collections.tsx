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
    <div className={cn('grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-8', className)}>
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
    <NFTCard
      src={card?.detailJson?.image}
      className="cursor-pointer"
      onClick={() => {
        router.push(`/nft/${card.collectionAddr}/${card.tokenId}`)
      }}{...rest}>
      <div>
        <div className="absolute right-2 top-2">
          <DeleteBtn data={card} owner={collectionItem?.collectionOwner} />
        </div>
        <div className="flex flex-col p-2 text-white bg-green">
          {card.tokenId && <div>{`${collectionItem?.name} #${card.tokenId}`}</div>}
          <div className="flex items-center justify-end gap-2">
            {collectionItem?.mintExpired! > Date.now() / 1000 && <ForkButton data={card} />}
            <BuyButton
              data={{
                ...card,
                derivedCollectionAddr: collectionItem?.derivedCollectionAddr,
              }}
            />
          </div>
        </div>
      </div>
    </NFTCard>
  );
}

export default Collections;
