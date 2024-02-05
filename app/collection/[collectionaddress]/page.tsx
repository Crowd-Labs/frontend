'use client';

import {
  BsDiscord,
  BsMedium,
  BsTwitter,
  BsTelegram,
  BsPlusLg,
  BsFillHouseHeartFill,
} from 'react-icons/bs';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CollectionInfo,
  NewNFTCreateds,
} from '@/lib/type';
import {
  getCollectionInfoByCollectionAddress,
  getAllNFTByCollectionAddress,
} from '@/api/thegraphApi';
import { format } from 'date-fns';
import { DERIVED_NFT_ABI } from '@/abis/BeCrowdProxy';
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import { baseGoerli } from 'wagmi/chains';
import { toAmount, getShortAddress } from '@/lib/utils';

import { getCollectionCreated } from '@/api/mongodbApi';
import { MongoCollection } from '@/models/createcollection';
import CollectionCards from './collections';
import { Divider } from '@/components/Footer';
import PixDialogForm from './dialog';
import { useRouter } from 'next/navigation';

import { GoChevronRight, GoChevronDown } from "react-icons/go";

function Collection({ params }: { params: { collectionaddress: string } }) {
  const [expanded, setExpand] = useState(false);
  const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
  const [collectionmongo, setCollection] = useState<MongoCollection>();
  const router = useRouter()
  const [nfts, setNFTs] = useState<NewNFTCreateds[]>();
  useEffect(() => {

    getCollectionInfoByCollectionAddress(params.collectionaddress).then((res) => setCollectionItem(res));

    getAllNFTByCollectionAddress(params.collectionaddress).then((res) => {
      setNFTs(res);
    });

    getCollectionCreated<MongoCollection[]>({ collectionId: params.collectionaddress }).then(
      (res) => setCollection(res?.[0]),
    );
  }, [params.collectionaddress]);

  const account = useAccount({
    onConnect: (data) => console.log('connected', data),
    onDisconnect: () => console.log('disconnected'),
  });

  const { data: totalReceivedEthRoyalty } = useContractRead({
    address: collectionItem?.derivedCollectionAddr as Address,
    abi: DERIVED_NFT_ABI,
    functionName: 'totalReceivedEthRoyalty',
  });

  const { data: totalItems } = useContractRead({
    address: collectionItem?.derivedCollectionAddr as Address,
    abi: DERIVED_NFT_ABI,
    functionName: 'getLastTokenId',
  });

  const { data: collectionBalance } = useBalance({
    address: collectionItem?.derivedCollectionAddr as Address,
    chainId: baseGoerli.id,
    watch: true,
  });

  const { data: releasable } = useContractRead({
    address: collectionItem?.derivedCollectionAddr as Address,
    abi: DERIVED_NFT_ABI,
    functionName: 'releasable',
    args: [account?.address || ''],
  });

  const { write: claimFromContract } = useContractWrite({
    address: collectionItem?.derivedCollectionAddr as Address,
    abi: DERIVED_NFT_ABI,
    functionName: 'release',
    onSuccess: (data) => {
      console.log('onSuccess data', data);
    },
    onError: (error) => {
      console.log('onError error', error);
    },
  });

  const claimRelease = () => {
    console.log('claimRelease');
    if (account?.address) {
      claimFromContract({ args: [account.address] });
    }
  };

  return (
    <div>
      {/* <img
        src={collectionItem?.detailJson?.image!}
        alt=""
        style={{ objectFit: 'cover' }}
        className="w-full h-56 -mb-32"
      /> */}
      <Divider className='my-0' />
      <div className="grid grid-cols-3 gap-20 px-24 py-5 text-white">
        <div className="col-span-2">
          <div className='flex gap-2 text-lg'>
            <img
              src={collectionItem?.detailJson?.image!}
              alt=""
              className="w-[84px] h-[84px] image-rendering-pixelated rounded-md"
            />
            <div className='flex-1'>
              <div className='flex justify-between'>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">
                    {collectionItem?.name}
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <div>By</div>
                    <span className="w-2 h-2 bg-[#46F12A] rounded-full" />
                    {collectionItem && <div>{getShortAddress(collectionItem?.collectionOwner || '')}</div>}
                  </div>
                </div>
                <div className="flex justify-between gap-8">
                  {collectionmongo?.website && (
                    <Link target="_blank" href={collectionmongo.website}>
                      <BsFillHouseHeartFill />
                    </Link>
                  )}
                  {collectionmongo?.twitter && (
                    <Link target="_blank" href={collectionmongo.twitter}>
                      <BsTwitter />
                    </Link>
                  )}
                  {collectionmongo?.telegram && (
                    <Link target="_blank" href={collectionmongo.telegram}>
                      <BsTelegram />
                    </Link>
                  )}
                  {collectionmongo?.medium && (
                    <Link target="_blank" href={collectionmongo.medium}>
                      <BsMedium />
                    </Link>
                  )}
                  {collectionmongo?.discord && (
                    <Link target="_blank" href={collectionmongo.discord}>
                      <BsDiscord />
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex gap-2 items-center">
                  <div className="text-white/60">Creators: </div>
                  <div>0</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-white/60">Items: </div>
                  <div>{`${new Number(totalItems)}`}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-white/60">Community earnings: </div>
                  <div>{`${(collectionItem?.baseRoyalty ?? 0) / 100}%`}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='text-sm'>
            {/* {collectionItem?.detailJson?.description && ( */}
            <div className="mt-4">
              <div>Collection description</div>
              <div className='opacity-60 flex gap-2 items-center mt-4' onClick={() => setExpand(!expanded)}>See more {expanded ? <GoChevronRight /> : <GoChevronDown />}</div>
              {expanded ? collectionItem?.detailJson?.description : ""}
            </div>
            {/* )} */}
            <div className="py-4">
              <div className="flex gap-6">
                <div className="flex gap-2 items-center">
                  <div>Total Royalty: </div>
                  <div>
                    {`${toAmount(
                      (totalReceivedEthRoyalty as BigNumber.Value) || 0,
                      18,
                    )} ETH`}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>Royalty Balance: </div>
                  <div>
                    {`${toAmount(
                      (collectionBalance?.value as unknown as BigNumber.Value) || 0,
                      18,
                    )} ETH`}
                  </div>
                </div>
              </div>
              <div className="flex gap-10 mt-4">
                <div className="flex gap-2 items-center">
                  <div> Your Share: </div>
                  <div>
                    {`${toAmount(
                      (releasable as BigNumber.Value) || 0,
                      18,
                    )} ETH`}
                  </div>
                </div>
                <div
                  className="bg-[#9BA885] p-1 rounded-sm"
                  onClick={claimRelease}
                >
                  Claim
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 text-sm">
          <div className="font-medium opacity-60">Rule</div>
          <div className="flex gap-4 mt-4">
            <div className="opacity-60">Mint Limit: </div>
            <div>{collectionItem?.mintLimit}</div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="opacity-60">End Time: </div>
            <div>
              {collectionItem?.mintExpired
                ? format(collectionItem?.mintExpired * 1000, 'PPP')
                : ''}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="opacity-60">Mint Price: </div>
            <div>{collectionItem?.mintPrice}</div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="opacity-60">Permission: </div>
            <div>Public</div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="opacity-60">Rights: </div>
            <div>
              To protect the quality of collection,Collection owner have
              rights to refund(gas not include) and delete any item within 7
              days after minted.
            </div>
          </div>
        </div>
      </div>
      <Divider className='my-0' />
      {/* <div className="flex w-full items-center justify-between mt-3 gap-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search by name"
            className="text-white"
          />
          <Button type="submit" className="bg-indigo-800">
            Search
          </Button>
        </div>
      </div> */}
      {nfts?.length === 0
        && collectionItem?.collectionOwner.toLocaleLowerCase()
        === account.address?.toLocaleLowerCase() && (
          <PixDialogForm onConfirm={(value) => {
            router.push(`/nft/create/${params.collectionaddress}?w=${value}`)
          }} />
        )}
      {nfts?.[0] && (
        <CollectionCards
          data={nfts}
          collectionItem={collectionItem}
          className="mt-4"
        />
      )}
    </div>
  );
}

export default Collection;
