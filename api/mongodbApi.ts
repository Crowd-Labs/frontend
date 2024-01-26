import { getReq } from './server/abstract';

export const getCollectionCreated = async <T>(params = {}): Promise<T> => {
  let response = await getReq<T>('/api/collection', params)
  return response
}

export const getMongoNFTById = async (collectionId: string, tokenId: string) => {
  let response: Array<any> = await getReq(`/api/nft`)
  let item = response?.filter((item) => {
    if (item.belongToCollectionId == collectionId && item.tokenId == tokenId) {
      return true
    }
    return false
  })
  console.log('response', response, 'item', item)
  return item?.[0]
}


export const getNFTCreateds = async<T>(params = {}): Promise<T> => {
  let response = await getReq<T>(`/api/nft`, params)

  // const newresponsePromise = (response as any[])?.map(async ({ imageUrl, ...nft }) => {
  //   let json = await parseCollectionDetailJson(imageUrl)
  //   return { ...nft, detailJson: json }
  // })

  // const newresponse = await Promise.all(newresponsePromise)
  return response 
}

export const getAllNFTCreateds = async<T>(): Promise<T> => {
  let response = await getReq<T>(`/api/nft`)
  return response
}
