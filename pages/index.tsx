import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { createPublicClient, http } from 'viem';
import { useAccount } from 'wagmi';
import { buildEndpoint, isVerified, parseAbi, getChain } from '../utils';

import ContractForm from '../components/ContractForm';
import ConstructorArgsForm from '../components/ConstructorArgsForm';

const Home: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [fromChainId, setFromChainId] = useState<string>('1');
  const [toChainId, setToChainId] = useState<string>('420');

  const [contractInfo, setContractInfo] = useState();
  const [creationBytecode, setCreationBytecode] = useState();
  const [parsedAbi, setParsedAbi] = useState();
  
  const [constructorArgs, setConstructorArgs] = useState([]);
  const [newContractAddress, setNewContractAddress] = useState('');
  
  const { address } = useAccount();  
  
  const fetchContractInfo = async (contract: `0x${string}`) => {
    try {
      const endpoint = buildEndpoint('contract', contract, fromChainId);
      const response = await fetch(endpoint);
      const json = await response.json();    
      console.log(json);
      
      if (json.status === '1') { 
        if (isVerified(json.result[0].ABI)) {
          setContractInfo(json.result[0]);
        } else {
          console.log('Error NO verified contract.');
        }
      } else {
        console.log('Error fetching contract.');
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  const fetchCreationBytecode = async (contract: `0x${string}`) => {
    try {
      const endpoint = buildEndpoint('creation', contract, fromChainId);
      const response = await fetch(endpoint);
      const json = await response.json();    
      console.log(json);
      
      if (json.status === '1') {
        const publicClient = createPublicClient({
          chain: getChain(parseInt(fromChainId)),
          transport: http()
        });
        const tx = await publicClient?.getTransaction({
          hash: json.result[0].txHash
        });
        
        setCreationBytecode(tx?.input ?? '');
      } else {
        console.log('Error fetching creation bytecode.');
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  const parseContractAbi = (abi) => {
    setParsedAbi(parseAbi(abi));
  }
 
  const deployOnSuperchain = async () => {
    if (!address) return;
    try {
      const walletClient = createWalletClient({
        chain: getChain(parseInt(toChainId)),
        transport: custom(window.ethereum)
      });
      
      const hash = await walletClient.deployContract({
        abi: contractInfo.ABI,
        account: address,
        args: constructorArgs,
        bytecode: creationBytecode.replace(contractInfo.ConstructorArguments, '')
      });
      
      console.log(`Contract successfully deployed at transaction: ${hash}`);
      const publicClient = createPublicClient({
        chain: getChain(parseInt(toChainId)),
        transport: http()
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(receipt);
      
      setNewContractAddress(receipt.to);
    } catch (err) {
      console.log(err);
    }
  }
  
  const verifyNewContract = () => {
    try {
      const endpoint = buildEndpoint('verify', newContractAddress, toChainId);
      const data = buildVerificationData(contractInfo, constructorArgs);
      console.log(endpoint+data);
      const response = await fetch(endpoint+data);
      const json = await response.json();
      console.log(json);
      
      if (json.status === '1') {
        await checkVerificationStatus(json.result);
      } else {
        console.log("Error verifying contract");
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  const checkVerificationStatus = async (guid: string) => {
    try {
      const endpoint = buildEndpoint('status-verify', guid, toChaindId);
      const response = await fetch(endpoint);
      const json = await response.json();
      console.log(json);
      
      if (json.status === '1') {
        if (json.result === 'Pending') {
          // delay some seconds and retry
          setTimeout(() => await checkVerificationStatus(guid), 7777);
        }
      } else {
        console.log("Error checking verification status");
      }      
    } catch (err) {
      console.log(err);
    }
  }
  
  const onSubmitContractForm = (
    contractAddress: `0x${string}`,
    fromChainId: string,
    toChainId: string
  ) => {
    setFromChainId(fromChainId);
    setToChainId(toChainId);
    setContractAddress(contractAddress);
  }
  
  // first trigger
  useEffect(() => {
    if (contractAddress) {
      fetchContractInfo(contractAddress);
    }
  }, [contractAddress]);
  
  // first trigger
  useEffect(() => {
    if (contractAddress) {
      fetchCreationBytecode(contractAddress);
    }
  }, [contractAddress]);
  
  // then
  useEffect(() => {
    if (contractInfo) {
      parseContractAbi(JSON.parse(contractInfo.ABI));
    }
  }, [contractInfo]);


  return (
    <div className={styles.container}>
      <Head>
        <title>Teleporter dapp</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">Teleporter</a>
        </h1>
        
        <p className={styles.description}>
         Every Super thing needs a cool transport. Teleporter is the SuperChain's one,<br></br>teleport contracts crossing chains like the real Supers.
        </p>
        
        <ContractForm onSubmit={onSubmitContractForm} />
        { parsedAbi && 
          <ConstructorArgsForm
            params={parsedAbi?.constructor?.inputs}
            onSubmit={setConstructorArgs}
          />
        }

        <div className={styles.grid}>
          <a className={styles.card} href="https://rainbowkit.com">
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a className={styles.card} href="https://wagmi.sh">
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
          >
            <h2>RainbowKit Examples &rarr;</h2>
            <p>Discover boilerplate example RainbowKit projects.</p>
          </a>

          <a className={styles.card} href="https://nextjs.org/docs">
            <h2>Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/vercel/next.js/tree/canary/examples"
          >
            <h2>Next.js Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            className={styles.card}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by J. Valeska
        </a>
      </footer>
    </div>
  );
};

export default Home;
