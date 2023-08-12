# Superchain Teleporter Station

Superchain Teleporter Station is a tool to migrate smart contracts, crossing chains like the real Supers. Teleport any verified smart contract between EVMs.

Superchain Teleporter Station allows you to migrate any previously verified smart contract by simply typing its current address, the source chain and the destination chain supporting changes in the constructor arguments.

It has never been easier to teleport a contract from Ethereum Layer 1 to the Superchain. In addition to teleports from layer 1 to layer 2, STS also supports migrations between superchains, from testnet to mainnet and vice versa. It could actually operate with any EVM.

Currently supports **Ethereum, Base, Optimism, Mode, Zora**... and their testnets (easy integration of future new chains)

# How it's Made

Teleportation is a very advanced alien technology and the ins and outs of its manufacture should not be divulged, but as a good open source lover and quoting the Joker, *here we go*.

Underneath all that paraphernalia hides a tiny bootstrapped application with next, viem, wagmi and Rainbow kit. That and a couple of APIs (Etherscan/Blockscout) are all the magic hidden under the hood of our powerful teleportation machine. Unlike the TARDIS(!), it's smaller on the inside. But just as in the TARDIS you can go anywhere in space-time with a couple of tweaks on the control panel, with Superchain Teleporter Station you can take a smart contract anywhere in the Superchain with a couple of clicks.

(!)Doctor Who reference. Don't ask. TARDIS = Time And Relative Dimension in Space aka a time-space machine that mimics an obsolete police phone box.

### Development

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
