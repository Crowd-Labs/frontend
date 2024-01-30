import pinataSDK from "@pinata/sdk";

// Paste your NFT.Storage API key into the quotes:
const PINATA_JWT_KEY = process.env.NEXT_PUBLIC_PINATA_JWT_KEY || '';
const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT_KEY });

export async function uploadNFTToPinata(image:any, name: string) {
  
  const options = {
    pinataMetadata: {
      name: name,
    },
  };
  const response = await pinata.pinFileToIPFS(image, options);
  return response.IpfsHash;
}

export async function uploadJsonToPinata(body:any, name: string) {
  const options = {
      pinataMetadata: {
          name: name
      },
  };
  const response = await pinata.pinJSONToIPFS(body, options)
  return response.IpfsHash;
}