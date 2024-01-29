import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { getReq } from './server/abstract';
import { sanitizeDStorageUrl } from '@/lib/utils';
import { CollectionInfo, NewNFTCreateds, StakeEthAmountForInitialCollection } from '@/lib/type';

const API_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || ""

/* create the API client */
export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})


/* define a GraphQL query  */

//get all collection info
export const queryAllCollectionInfo = gql`
  query newCollectionCreateds {
    newCollectionCreateds {
      collectionOwner
      derivedCollectionAddr
      derivedRuleModule
      collectionId
      baseRoyalty
      mintLimit
      mintExpired
      mintPrice
      whiteListRootHash
      collInfoURI
      name
      blockTimestamp
      items
    }    
  }
`

//get collection info by collection id
export const queryCollectionInfoByCollectionAddress = gql`
  query newCollectionCreateds ($derivedCollectionAddr: String!){
    newCollectionCreateds(where: {derivedCollectionAddr: $derivedCollectionAddr}) {
      collectionOwner
      derivedCollectionAddr
      derivedRuleModule
      collectionId
      baseRoyalty
      mintLimit
      mintExpired
      mintPrice
      whiteListRootHash
      collInfoURI
      name
      blockTimestamp
      items
    }    
  }
`

/* define a GraphQL query  */
//get all nft from becrowd platform
export const queryAllNFT = gql`
  query getNewNFTCreateds {
    newNFTCreateds {
      id
      blockNumber
      blockTimestamp
      collectionId
      derivedFrom
      collectionAddr
      nftInfoURI
      tokenId
      transactionHash
    }    
  }
`

//get all nft of one collection
export const queryAllNFTByCollectionAddress = gql`
  query getNewNFTCreateds ($collectionAddr: String!){
    newNFTCreateds(where: {collectionAddr: $collectionAddr}) {
      id
      blockNumber
      blockTimestamp
      collectionId
      derivedFrom
      collectionAddr
      nftInfoURI
      tokenId
      transactionHash
    }    
  }
`

// filter collection
export const filterCollectionByMintExpired = gql`
  query filterCollectionByMintExpired($mintExpired: String!) {
    newCollectionCreateds(where: {mintExpired_gte: $mintExpired} orderBy: mintExpired) {
      collectionOwner
      derivedCollectionAddr
      derivedRuleModule
      collectionId
      baseRoyalty
      mintLimit
      mintExpired
      mintPrice
      whiteListRootHash
      collInfoURI
      name
      blockTimestamp
      items
  }
}
`

// filter collection
export const queryStakeEthAmountForInitialCollection = gql`
  query getStakeEthAmountSets {
    createCollectionStakeEthAmountSets(orderBy: blockTimestamp, orderDirection: desc, first: 1) {
      id
      prevStakeEthAmount
      newStakeEthAmount
      blockTimestamp
  }
}
`

export const parseCollectionDetailJson = async (collInfoURI: string) => {
  let url = sanitizeDStorageUrl(collInfoURI);
  let json: any = await getReq(url)
  if (json?.image) json.image = sanitizeDStorageUrl(json.image);
  return json
}

export const getAllCollectionInfo = async () => {
  let response: { data: { newCollectionCreateds: CollectionInfo[] } } = await client.query({ query: queryAllCollectionInfo })
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: CollectionInfo) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
 
  return collections.filter((item) => !!item)
}

// get collection info by collection id
export const getCollectionInfoById = async (collectionAddress: string) => {
  let response: { data: { newCollectionCreateds: CollectionInfo[] } } = await client.query({
    query: queryCollectionInfoByCollectionAddress,
    variables: { collectionAddress }
  })
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: CollectionInfo) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections?.[0]
}

//get all nft of one colelction
export const getAllNFTByCollectionId = async (collectionAddress: string) => {
  let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
    query: queryAllNFTByCollectionAddress,
    variables: { collectionAddress }
  })
  console.log('getNewNFTCreateds response', response)
  let collections = await Promise.all(response.data.newNFTCreateds.map(async (collection: NewNFTCreateds) => {
    let json = await parseCollectionDetailJson(collection.nftInfoURI)
    return { ...collection, detailJson: json }
  }))
  console.log('getNewNFTCreateds response', collections)
  return collections
}

//get all nft of becrowd platform
export const getAllNFT = async () => {
  let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
    query: queryAllNFT
  })
  let collections = await Promise.all(response.data.newNFTCreateds.map(async (collection: NewNFTCreateds) => {
    let json = await parseCollectionDetailJson(collection.nftInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections
}

//get all unfinish collection
export const getUnFinishCollection = async (mintExpired: string) => {
  let unExpiredCollectionResponse: { data: { newCollectionCreateds: CollectionInfo[] } } = await client.query({
    query: filterCollectionByMintExpired,
    variables: { mintExpired }
  })

  let collections = await Promise.all(unExpiredCollectionResponse.data.newCollectionCreateds.map(async (collection: CollectionInfo) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections
}

export const getStakeEthAmountForInitialCollection = async () => {
  let response: { data: { createCollectionStakeEthAmountSets: StakeEthAmountForInitialCollection[] } } = await client.query({
    query: queryStakeEthAmountForInitialCollection
  })
  let stakeEthAmountInfos = response?.data?.createCollectionStakeEthAmountSets
  return stakeEthAmountInfos?.[0]
}