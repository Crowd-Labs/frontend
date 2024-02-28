'use client';

import * as React from 'react';
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  bitgetWallet
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import { Chain } from '@rainbow-me/rainbowkit'

export const blast = {
  id: 168587773,
  name: 'Blast Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Blast',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.blast.io'] },
    default: { http: ['https://sepolia.blast.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'blast', url: 'https://testnet.blastscan.io' },
    default: { name: 'blast', url: 'https://testnet.blastscan.io' },
  },
} as const satisfies Chain;


const chains: readonly [Chain, ...Chain[]] = [
  {
    ...blast
  },
];
const queryClient = new QueryClient()
const projectId = '746a0239f7d6fbd6e1ddd2d61c9c6358';

const config = getDefaultConfig({
  appName: 'C Web3',
  projectId,
  chains,
  wallets:[{groupName:"Suggested", wallets:[
    metaMaskWallet,
    rainbowWallet,
    coinbaseWallet,
    walletConnectWallet,
    bitgetWallet
  ]}], 
})


export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
