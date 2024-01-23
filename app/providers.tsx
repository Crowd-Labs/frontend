'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from '@wagmi/core'

export const blast = {
  id: 168587773,
  name: 'Blast Sepolia',
  network: 'Blast',
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
} as const satisfies Chain

const { chains, publicClient } = configureChains(
  [
    blast,
  ],
  [publicProvider()]
);

const projectId = '746a0239f7d6fbd6e1ddd2d61c9c6358'

const { connectors } = getDefaultWallets({
  appName: 'C Web3',
  projectId,
  chains,
});

const demoAppInfo = {
  appName: 'C Web3 Dapp',
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}