import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import {
  baseGoerli,
  goerli,
  mainnet,
  //modeTestnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet,
  Chain
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const modeTestnet = {
  id: 919,
  name: 'Mode Testnet',
  network: 'mode-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sepolia.mode.network'],
    },
    public: {
      http: ['https://sepolia.mode.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://sepolia.explorer.mode.network',
    },
  },
  testnet: true,
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    baseGoerli,
    goerli,
    mainnet,
    modeTestnet,
    optimism,
    optimismGoerli,
    polygon,
    polygonMumbai,
    zora,
    zoraTestnet
  ],
  [publicProvider(), alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string})]
);

const { connectors } = getDefaultWallets({
  appName: 'Teleporter',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme({accentColor: '#b6b6b6', accentColorForeground: 'black', borderRadius: 'none'})}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
