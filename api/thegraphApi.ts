import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { getReq } from './server/abstract';
import { sanitizeDStorageUrl } from '@/lib/utils';
import { NewCollectionCreateds, NewNFTCreateds, CollectionMintInfo, CollectionFreeInfo } from '@/lib/type';

//const API_URL = 'https://api.studio.thegraph.com/query/50436/BeCrowd_subgraph_base/version/latest';
const API_URL = 'https://thegraph.optree.xyz/subgraphs/name/BeCrowd_subgraph';

/* create the API client */
export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})


/* define a GraphQL query  */
export const newCollectionCreatedsDoc = gql`
  query newCollectionCreateds {
    newCollectionCreateds {
      baseRoyalty
      blockNumber
      blockTimestamp
      collInfoURI
      collectionId
      collectionOwner
      collectionType
      derivedCollectionAddr
      derivedRuleModule
      id
      timestamp
      transactionHash
    }    
  }
`


export const newCollectionCreatedByIdDoc = gql`
  query newCollectionCreateds ($collectionId: String!){
    newCollectionCreateds(where: {collectionId: $collectionId}) {
      baseRoyalty
      blockNumber
      blockTimestamp
      collInfoURI
      collectionId
      collectionOwner
      collectionType
      derivedCollectionAddr
      derivedRuleModule
      id
      timestamp
      transactionHash
    }    
  }
`


/* define a GraphQL query  */
export const newAllNFTCreatedsDoc = gql`
  query getNewNFTCreateds {
    newNFTCreateds {
      blockNumber
      blockTimestamp
      collectionId
      derivedFrom
      id
      nftInfoURI
      tokenId
      transactionHash
    }    
  }
`

export const newNFTCreatedsDoc = gql`
  query getNewNFTCreateds ($collectionId: String!){
    newNFTCreateds(where: {collectionId: $collectionId}) {
      blockNumber
      blockTimestamp
      collectionId
      derivedFrom
      id
      nftInfoURI
      tokenId
      transactionHash
    }    
  }
`

export const newCollectionMintInfosDoc = gql`
  query newCollectionMintInfos ($collectionId: String!){
    newCollectionMintInfos(where: {collectionId: $collectionId}) {
      id
      mintExpired
      mintLimit
      mintPrice
      collectionId
    }    
  }
`
// filter collection
export const filterCollectionByMintExpired = gql`
    query filterCollectionByMintExpired($mintExpired: String!) {
      newCollectionMintInfos(where: {mintExpired_gte: $mintExpired} orderBy: mintExpired) {
        mintExpired
        collectionId
    }
  }
`

// filter collection
export const queryCollections = gql`
    query queryCollections($ids:[String!]) {
      newCollectionCreateds(where:{collectionId_in:$ids}) {
        baseRoyalty
        blockNumber
        blockTimestamp
        collInfoURI
        collectionId
        collectionOwner
        collectionType
        derivedCollectionAddr
        derivedRuleModule
        id
        timestamp
        transactionHash
      }
  }
`
// filter collection
export const queryCollectionFee = gql`
    query collectionFeeAddressSets {
  collectionFeeAddressSets(orderBy: timestamp, orderDirection: desc, first: 1) {
    id
    transactionHash
    timestamp
    prevMaxBaseRoyalty
    blockNumber
    blockTimestamp
    caller
    newMaxBaseRoyalty
  }
}
`

export const parseCollectionDetailJson = async (collInfoURI: string) => {
  let url = sanitizeDStorageUrl(collInfoURI);
  let json: any = await getReq(url)
  if (json.image) json.image = sanitizeDStorageUrl(json.image);
  return json
}

export const getNewCollectionCreated = async (size?: number, offset?: number) => {
  let response: { data: { newCollectionCreateds: NewCollectionCreateds[] } } = await client.query({ query: newCollectionCreatedsDoc })
  console.log('getNewCollectionCreated response', response)
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: NewCollectionCreateds) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections.filter((item) => !!item)
}

export const getNewNFTCreatedByCollectionId = async (collectionId: string) => {
  let response: { data: { newCollectionCreateds: NewCollectionCreateds[] } } = await client.query({
    query: newCollectionCreatedByIdDoc,
    variables: { collectionId }
  })
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: NewCollectionCreateds) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections?.[0]
}

export const getNewNFTCreateds = async (collectionId: string) => {
  let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
    query: newNFTCreatedsDoc,
    variables: { collectionId }
  })
  console.log('getNewNFTCreateds response', response)
  let collections = await Promise.all(response.data.newNFTCreateds.map(async (collection: NewNFTCreateds) => {
    let json = await parseCollectionDetailJson(collection.nftInfoURI)
    return { ...collection, detailJson: json }
  }))
  console.log('getNewNFTCreateds response', collections)
  return collections
}

export const getAllNewNFTCreateds = async () => {
  let response: { data: { newNFTCreateds: NewNFTCreateds[] } } = await client.query({
    query: newAllNFTCreatedsDoc
  })
  console.log('getAllNewNFTCreateds response', response)
  let collections = await Promise.all(response.data.newNFTCreateds.map(async (collection: NewNFTCreateds) => {
    let json = await parseCollectionDetailJson(collection.nftInfoURI)
    return { ...collection, detailJson: json }
  }))
  console.log('getAllNewNFTCreateds response', collections)
  return collections
}

export const getNewCollectionMintInfo = async (collectionId: string) => {
  let response: { data: { newCollectionMintInfos: CollectionMintInfo[] } } = await client.query({
    query: newCollectionMintInfosDoc,
    variables: { collectionId }
  })
  let collectionInfo = response.data.newCollectionMintInfos
  console.log('getNewCollectionMintInfo response', response)
  return collectionInfo?.[0]
}

export const getUnMintExpiredCollection = async (mintExpired: string) => {
  let unExpiredCollectionResponse: { data: { newCollectionMintInfos: CollectionMintInfo[] } } = await client.query({
    query: filterCollectionByMintExpired,
    variables: { mintExpired }
  })
  const collectionIds = unExpiredCollectionResponse.data.newCollectionMintInfos.map(col => col.collectionId)
  console.log("ids", collectionIds)
  let response: { data: { newCollectionCreateds: NewCollectionCreateds[] } } = await client.query({
    query: queryCollections,
    variables: { ids: collectionIds }
  })
  console.log('getUnMintExpiredCollection response', response)

  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: NewCollectionCreateds) => {
    let json = await parseCollectionDetailJson(collection.collInfoURI)
    return { ...collection, detailJson: json }
  }))
  return collections
}

export const getNewCollectionFee = async () => {
  let response: { data: { collectionFeeAddressSets: CollectionFreeInfo[] } } = await client.query({
    query: queryCollectionFee
  })
  let collectionInfo = response.data.collectionFeeAddressSets
  console.log('getCollectionFreeInfo response', response)
  return collectionInfo?.[0]
}
