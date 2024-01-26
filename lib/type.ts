export type DetailJson = {
  description: string
  content: string
  external_link: string
  image: string
  name: string,
  attributes: []
}


export type NewCollectionCreateds = {
  id: string
  baseRoyalty: number
  blockNumber: number | string
  blockTimestamp: number | string
  collInfoURI: string
  collectionId: string
  collectionOwner: string
  collectionType: string
  derivedRuleModule: string
  derivedCollectionAddr: string
  timestamp: string
  transactionHash: string
  detailJson: DetailJson
}

export type CollectionMintInfo = {
  id: string
  mintExpired: number
  mintLimit: number
  mintPrice: number
  collectionId: string
}

export type CollectionFreeInfo = {
  id: string
  timestamp: number
  prevMaxBaseRoyalty: number
  blockNumber: number
  blockTimestamp: number
  newMaxBaseRoyalty: bigint
}

export type NewNFTCreateds = {
  id: string
  blockNumber: number | string
  blockTimestamp: number | string
  nftInfoURI: string
  collectionId: string
  derivedFrom: string
  tokenId: string
  transactionHash: string
  detailJson: DetailJson
}

export type CollectionIdQueryRequest = {
  /** The collection id */
  collectionId: string
}

export type CollectionInfoProps = {
  collectionName: string,
  collectionDesc: string,
  creator: string,
  collectionId: number,
  category: number,
  logoImage: string,
  website: string,
  twitter: string,
  telegram: string,
  medium: string,
  discord: string,
  mintLimit: number,
  royalty: number,
  endTime: Date,
  bCharge: boolean,
  mintPrice: number,
  currency: string,
  receiptAddress: string,
  bWhitelist: boolean,
  whitelistRootHash: string,
}

export type NFTInfoProps = {
  nftName: string,
  belongToCollectionId: number,
  nftCreator: string,
  nftOwner: string,
  forkFrom: number,
  prompt: string,
  nagativePrompt: string,
  imageUrl: string,
  tokenId: number
}
declare global {
  interface Window {
   	timer: number;
  }
}