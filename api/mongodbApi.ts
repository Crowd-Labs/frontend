import { getReq } from './server/abstract';

export const getCollectionCreated = async <T>(params = {}): Promise<T> => {
  const response = await getReq<T>('/api/collection', params);
  return response;
};

// export const getMongoNFTById = async (collectionaddress: string, tokenId: string) => {
//   const response: Array<any> = await getReq('/api/nft');
//   const item = response?.filter((item) => {
//     if (item.collectionAddress == collectionaddress && item.tokenId == tokenId) {
//       return true;
//     }
//     return false;
//   });
//   console.log('response', response, 'item', item);
//   return item?.[0];
// };

// export const getNFTCreateds = async<T>(params = {}): Promise<T> => {
//   const response = await getReq<T>('/api/nft', params);

//   // const newresponsePromise = (response as any[])?.map(async ({ imageUrl, ...nft }) => {
//   //   let json = await parseCollectionDetailJson(imageUrl)
//   //   return { ...nft, detailJson: json }
//   // })

//   // const newresponse = await Promise.all(newresponsePromise)
//   return response;
// };

// export const getAllNFTCreateds = async<T>(): Promise<T> => {
//   const response = await getReq<T>('/api/nft');
//   return response;
// };
