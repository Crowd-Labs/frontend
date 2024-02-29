export interface DetailJson {
  description: string
  content: string
  external_link: string
  image: string
  name: string,
  attributes: any[]
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
  blockTimestamp: number | string
  items: number
  detailJson: DetailJson
}

export interface Creator {
  address: string
  itemsNFT: number
}

export interface CreatorRank extends Creator{
  itemsCollection: number
}

export interface StakeEthAmountForInitialCollection {
  id: string
  prevStakeEthAmount: number
  newStakeEthAmount: number
  blockTimestamp: number
}

export interface ProjectInfo {
  creatorsNum: number
  totalCollectioinNum: number
  totalNFTNum: number
  totalTx: number
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

declare global {
  interface Window {
   	timer: number;
  }
}