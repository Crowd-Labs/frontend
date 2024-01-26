'use client';

import {
  BsDiscord,
  BsMedium,
  BsTwitter,
  BsTelegram,
  BsPlusLg,
  BsFillHouseHeartFill,
} from 'react-icons/bs';

import UserAvatar from '@/components/UserAvatar';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CollectionInfo,
  NewNFTCreateds,
} from '@/lib/type';
import {
  getCollectionInfoById,
  getAllNFTByCollectionId,
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
import { toAmount } from '@/lib/utils';

import { getCollectionCreated } from '@/api/mongodbApi';
import { MongoCollection } from '@/models/createcollection';
import { DefaultNFTS } from '@/constants';
import Image from 'next/image';
import CollectionCards from './collections';

function Collection({ params }: { params: { id: string } }) {
  const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
  const [collectionmongo, setCollection] = useState<MongoCollection>();

  const [nfts, setNFTs] = useState<NewNFTCreateds[]>(DefaultNFTS);
  useEffect(() => {
    getCollectionInfoById(params.id).then((res) => setCollectionItem(res));

    getAllNFTByCollectionId(params.id).then((res) => {
      console.log('res', res);
      setNFTs(res);
    });

    getCollectionCreated<MongoCollection[]>({ collectionId: params.id }).then(
      (res) => setCollection(res?.[0]),
    );
  }, [params.id]);

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
    <div className="container mx-auto">
      <Image
        src={collectionItem?.detailJson.image!}
        alt=""
        style={{ objectFit: 'cover' }}
        className="w-full h-56 -mb-32"
      />
      <div className="px-10 ">
        <Image
          src={collectionItem?.detailJson.image!}
          alt=""
          className="w-40 h-40"
        />
        <div className="grid grid-cols-3 gap-14 text-lg text-white">
          <div className="col-span-2">
            <div className="flex justify-between items-center mt-4">
              <div className="text-2xl font-medium">
                {collectionItem?.detailJson.name}
              </div>
              <div className="flex justify-between gap-2">
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
            <div className="flex gap-2 items-center mt-4">
              <div>By</div>
              {collectionItem && <UserAvatar created={collectionItem} />}
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex gap-2 items-center">
                <div className="text-white-rgba">Creators</div>
                <div>0</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-white-rgba">Items </div>
                <div>{`${new Number(totalItems)}`}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-white-rgba">Community earnings</div>
                <div>{`${(collectionItem?.baseRoyalty ?? 0) / 100} %`}</div>
              </div>
            </div>
            <div className="mt-4">
              {collectionItem?.detailJson.description}
            </div>
            <div className="py-4 px-2">
              <div className="flex gap-6">
                <div className="flex gap-2 items-center">
                  <div className="text-white-rgba">Total Royalty: </div>
                  <div>
                    {`${toAmount(
                        totalReceivedEthRoyalty || 0,
                        18,
                      )} ETH`}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-white-rgba">Royalty Balance: </div>
                  <div>
                    {`${toAmount(
                        collectionBalance?.value || 0,
                        18,
                      )} ETH`}
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex gap-2 items-center">
                  <div className="text-white-rgba"> Your Share: </div>
                  <div>
                    {`${toAmount(
                        releasable || 0,
                        18,
                      )} ETH`}
                  </div>
                </div>
                <div
                  className="bg-indigo-800 p-1 rounded-sm"
                  onClick={claimRelease}
                >
                  Claim
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-2xl font-medium text-white-rgba">Rule</div>
            <div className="flex gap-4 mt-4">
              <div className="text-white-rgba">Mint Limit: </div>
              <div>{collectionItem?.mintLimit}</div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="text-white-rgba">End Time: </div>
              <div>
                {collectionItem?.mintExpired
                  ? format(collectionItem?.mintExpired * 1000, 'PPP')
                  : ''}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="text-white-rgba">Mint Price: </div>
              <div>{collectionItem?.mintPrice}</div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="text-white-rgba">Permission: </div>
              <div>Public</div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="text-white-rgba">Rights: </div>
              <div>
                To protect the quality of collection,Collection owner have
                rights to refund(gas not include) and delete any item within 7
                days after minted.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-2 border-[#D9D9D9] mt-7" />
      <div className="flex w-full items-center justify-between mt-3 gap-4">
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
      </div>
      {nfts?.length === 0
          && collectionItem?.collectionOwner.toLocaleLowerCase()
            === account.address?.toLocaleLowerCase() && (
            <Link
              href={`/NFT/Create/${params.id}`}
              className="flex flex-col items-center justify-center w-[15.18125rem] mt-4 h-[18.75rem] border text-white"
            >
              <BsPlusLg className="w-36 h-36" />
              Initail Ancestor NFT
            </Link>
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
