"use client";
import BuyButton from "@/components/Button/BuyBtn";
import ForkButton from "@/components/Button/ForkBtn";
import Link from "next/link";
import DeleteBtn from "@/components/Button/DeleteBtn";
import { NFTCard } from "@/components/Collection/NFTCards";
import { cn } from "@/lib/utils";
import { NewCollectionCreateds, NewNFTCreateds } from "@/lib/type";

const Collections = (props: {
  data: NewNFTCreateds[];
  collectionItem: NewCollectionCreateds | undefined;
  className?: string;
}) => {
  const { data = [], className, ...rest } = props;
  return (
    <div className={cn("grid grid-cols-4 gap-4 py-8", className)}>
      {data.map((card) => (
        // <Link key={card.id} href={`/NFT/${card.collectionId}/${card.tokenId}`}>
        <CollectionCard data={card} {...rest} key={card.id} />
        // </Link>
      ))}
    </div>
  );
};

export const CollectionCard = (props: {
  data: NewNFTCreateds;
  collectionItem: NewCollectionCreateds | undefined;
  children?: React.ReactNode;
  [index: string]: any;
}) => {
  const { data: card, collectionItem, ...rest } = props;

  return (
    <NFTCard src={card?.src} {...rest}>
      <>
        <div className="absolute right-2 top-2">
          <DeleteBtn data={card} owner={collectionItem?.collectionOwner} />
        </div>
        <div className="absolute w-full bottom-0 h-11 flex items-center justify-between px-2 gap-2 text-white">
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
  );
};

export default Collections;
