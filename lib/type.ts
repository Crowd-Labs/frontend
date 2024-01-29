export interface DetailJson {
  description: string
  content: string
  external_link: string
  image: string
  name: string,
  attributes: any[]
}

export interface NewCollectionCreateds {
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

export interface CollectionInfo {
  collectionOwner: string
  derivedCollectionAddr: string
  derivedRuleModule: string
  collectionId: string
  baseRoyalty: number
  mintLimit: number
  mintExpired: number
  mintPrice: number
  whiteListRootHash: string
  collInfoURI: string
  name: string
  blockNumber: number | string
  blockTimestamp: number | string
  transactionHash: string
  items: number
  detailJson: DetailJson
}

export interface StakeEthAmountForInitialCollection {
  id: string
  prevStakeEthAmount: number
  newStakeEthAmount: number
  blockTimestamp: number
}

export interface NewNFTCreateds {
  id: string
  tokenId: string
  collectionId: string
  derivedFrom: string
  collectionAddr: string
  creator: string
  nftInfoURI: string
  blockNumber: number | string
  blockTimestamp: number | string
  transactionHash: string
  detailJson: DetailJson
}

export interface CollectionIdQueryRequest {
  /** The collection id */
  collectionId: string
}

export interface CollectionInfoProps {
  collectionName: string,
  collectionDesc: string,
  creator: string,
  collectionId: number,
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

export interface NFTInfoProps {
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