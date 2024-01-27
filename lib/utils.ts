import { IPFS_GATEWAY_URL } from '@/constants';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBase64(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result || ''));
    reader.onerror = (error) => reject(error);
  });
}

export function getBlob(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(new Blob([reader.result || '']));
    reader.onerror = (error) => reject(error);
  });
}

export function sanitizeDStorageUrl(url: string) {
  const ipfsGateway = `${IPFS_GATEWAY_URL}/`;
  if (!url) {
    return url;
  }

  return url
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${ipfsGateway}/${url}`)
    .replace('https://ipfs.io/ipfs', ipfsGateway)
    .replace('https://ipfs.infura.io/ipfs', ipfsGateway)
    .replace('ipfs://', ipfsGateway)
    .replace('ipfs://ipfs/', ipfsGateway);
}

export const trimify = (value: string): string => value?.trim();

export const base64toBuff = (data: string) => {
  const arr = data.split(',');
  const buffer = Buffer.from(arr[1], 'base64');
  // new Blob(buffer)
  const array = new Uint8Array(buffer, 0, buffer.length);
  return Array.from(array);
};

// Base64 to Blob
export const dataURLtoBlob = (dataurl: any) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const toAmount = (s: BigNumber.Value, decimals: number) => {
  const value = new BigNumber(s);
  const divide = new BigNumber(10 ** decimals);
  return value.dividedBy(divide).toFixed(4);
};

export const bignumberPlus = (add1: BigNumber.Value, add2: BigNumber.Value, decimals: number) => {
  const value1 = new BigNumber(add1);
  const value2 = new BigNumber(add2);
  const divide = new BigNumber(10 ** decimals);
  return value1.plus(value2).dividedBy(divide).toFixed(4);
};
export const shuffleArray = <T>(array: T[] = []): T[] => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const getShortAddress = (address: string): string => {
  const shortAddress = address.slice(-4);
  return `0x${shortAddress}`;
};

export const calNextCollectionContractAddr = (implementationAddress: string, salt: string): string => {
  // Concatenate the bytecode, deploying address, and salt
  const abiCoder = new ethers.AbiCoder()
  const data = abiCoder.encode(
    ['bytes', 'address', 'bytes32'],
    ['0x3d602d80600a3d3981f3363d3d373d3d3d363d73', implementationAddress, salt]
  );

  // Take the last 20 bytes of the hash to get the contract address
  const contractAddress = '0x' + data.substring(26);

  return contractAddress;
}