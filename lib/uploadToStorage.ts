// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFTSTORAGE_KEY || ''
const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

/**
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param {string} imagePath the path to an image file
  * @param {string} name a name for the NFT
  * @param {string} description a text description for the NFT
  */
export async function storeNFT(image:any, name: string, description: string) {
   
    // call client.store, passing in the image & metadata
    return await nftstorage.store({
        image,
        name,
        description,
    })
}

export async function storeBlob(data: string) {
  const cid = await nftstorage.storeBlob(new Blob([data]))
  return cid
}

export async function storeCar(someData: Blob) {
  //console.log('storeCar', data)
  //const someData = new Blob([data])
  const { car } = await NFTStorage.encodeBlob(someData)
  const cid = await nftstorage.storeCar(car)
  console.log('storeCar', cid)
  return cid
}