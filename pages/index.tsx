import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { createPublicClient, http, createWalletClient, custom, encodeAbiParameters } from 'viem';
import { useAccount } from 'wagmi';
import { buildEndpoint, isVerified, parseAbi, getChain, buildVerificationData } from '../utils';

import ContractForm from '../components/ContractForm';
import ConstructorArgsForm from '../components/ConstructorArgsForm';

const Home: NextPage = () => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [fromChainId, setFromChainId] = useState<string>('1');
  const [toChainId, setToChainId] = useState<string>('420');

  const [contractInfo, setContractInfo] = useState<any>();
  const [creationBytecode, setCreationBytecode] = useState<string>('');
  const [parsedAbi, setParsedAbi] = useState<any>();
  
  const [constructorArgs, setConstructorArgs] = useState<Array<any>>([]);
  const [newContractAddress, setNewContractAddress] = useState<string>('');
  const [isNewContractVerified, setIsNewContractVerified] = useState<boolean>(false);
  const [showDeploymentDetails, setShowDeploymentDetails] = useState<boolean>(false);
  
  const { address } = useAccount();  
  
  const fetchContractInfo = async (contract: string) => {
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
  
  const fetchCreationBytecode = async (contract: string) => {
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
 
  const deployOnSuperchain = async (constructorArgs) => {
    if (!address || !contractInfo) return;
    try {
      const walletClient = createWalletClient({
        chain: getChain(parseInt(toChainId)),
        transport: custom((window as any).ethereum)
      });

      const hash = await walletClient.deployContract({
        abi: JSON.parse(contractInfo?.ABI),
        account: address,
        chain: getChain(parseInt(toChainId)),
        args: constructorArgs.map(arg => arg.value),
        bytecode: creationBytecode.replace(contractInfo.ConstructorArguments, '') as `0x${string}`
      });
      
      console.log(`Contract successfully deployed at transaction: ${hash}`);
      const publicClient = createPublicClient({
        chain: getChain(parseInt(toChainId)),
        transport: http()
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(receipt);
      
      setNewContractAddress(receipt?.contractAddress ?? '');
      setConstructorArgs(constructorArgs);
    } catch (err) {
      console.log(err);
    }
  }
  
  const verifyNewContract = async () => {
    try {
      const endpoint = buildEndpoint('verify', newContractAddress, toChainId);
      const data = buildVerificationData(
        contractInfo, 
        encodeAbiParameters(
          parsedAbi?.constructor.inputs ?? [], 
          (constructorArgs ?? []).map(arg => arg.value)
        )
      );
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: data 
      });
      const json = await response.json();
      console.log(json);
      
      if (json.status === '1') {
        await checkVerificationStatus(json.result);
      } else if (json.result.startsWith('Unable to locate ContractCode') 
        && newContractAddress) {
         setTimeout(async () => await verifyNewContract(), 7777);  
      } else {
        // Silently failing verification
        console.log("Error verifying contract");
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 0xa2f729AAEA2434E4E1bb3455fe1D2eB172058D8a goerli supercontract
  // 0xBb7ca7a34cE4D4808385c117101657026d861292 baseG supercontract
  // 0xFee1360fe085557D16c47124e1324517cF43B7B9 goerli supercontract args
  // 0x5B95D080F83c4a69E3C5462f90AD569DCC31794e optimismG supercontract
  // 0x42c500eFe11424f479dE18C4095537478511BeB3 optimismG supercontract args imports
  // 0x8a3f0a10f4f168fb817bfa9a0f8cff8db2d133cf baseG supercontract args
  // 0x9bcc6bd2a72af329e28fe3df632b4db89a4ee9a7 optimismG supercontract args
  // 0x97aBfD858Cdac2d099116309B178452bA4025112 sepolia supercontract args imports
  // 0xE89F808103aAc03663E080E7ff1B5ef6d9da562D optimismG supercontract args imports
  // 0x569c819df088b7947f9db31f3271fe7cb92bca11 zoraT supercontract args imports
  // 0x569c819df088b7947f9db31f3271fe7cb92bca11 baseG fail from zoraT
  // 0x8A3F0A10F4f168FB817BFa9A0F8cFF8dB2d133cf modeT supercontract args imports
  // 0x83Bf9F56E703A87fC05eabB6933E1A8D5ceC87f3 zoraT EAS
  // 0xBb7ca7a34cE4D4808385c117101657026d861292 zoraT EAS Registry
  
  const checkVerificationStatus = async (guid: string) => {
    try {
      const endpoint = buildEndpoint('status-verify', guid, toChainId);
      const response = await fetch(endpoint);
      const json = await response.json();
      console.log(json);
      
      if (json.status === '1') {
        console.log(json.result);
        if (json.result === 'Pass - Verified') {
          setIsNewContractVerified(true);
        } else if (json.result === 'Pending in queue' || json.result === 'Unknown UID') {
          // delay some seconds and retry, blockscout
          setTimeout(async () => await checkVerificationStatus(guid), 7777);          
        }
      } else if (json.result === 'Pending in queue') {
        // delay some seconds and retry, etherscan
        setTimeout(async () => await checkVerificationStatus(guid), 7777);        
      } else if (json.result === 'Already Verified') {
        setIsNewContractVerified(true);
      }else {
        console.log("Error checking verification status");
      }      
    } catch (err) {
      console.log(err);
    }
  }
  
  const onSubmitContractForm = (
    contractAddress: string,
    fromChainId: string,
    toChainId: string
  ) => {
    setFromChainId(fromChainId);
    setToChainId(toChainId);
    setContractAddress(contractAddress);
  }
  
  const openDeploymentDetails = () => {
    setShowDeploymentDetails(
      prevShowDeploymentDetails => !prevShowDeploymentDetails
    );
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

  // finally
  useEffect(() => {
    if (newContractAddress) {
      verifyNewContract();
    }
  }, [newContractAddress]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Teleporter dapp</title>
        <meta
          content="Teleporter is a cross chain smart contracts migrator"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        

        <h1 className={styles.title}>
          <small>WELCOME TO</small> <a href="">TELEPORTER</a>
        </h1>
        
        <p className={` uppercase ${styles.description}`}>
         Every <span>Super</span> thing needs a cool transport. <span>Teleporter</span> is the SuperChain&apos;s one,<br></br>teleport contracts crossing chains like the real Supers.
        </p>
        
        <ConnectButton />
        
        <ContractForm onSubmit={onSubmitContractForm} />
        { parsedAbi && 
          <ConstructorArgsForm
            params={parsedAbi?.constructor?.inputs}
            onSubmit={deployOnSuperchain}
          />
        }
        
        { newContractAddress && <p>CONTRACT TELEPORTED TO {newContractAddress} ON {getChain(parseInt(toChainId)).name.toUpperCase()}</p> }
        
        { (newContractAddress && isNewContractVerified) && (
            <p className="uppercase">Contract successfully Verified</p>
          ) }
          
        { contractInfo && (
            <button 
              className="btn-outline uppercase mt-8"
              onClick={openDeploymentDetails}
            >
              See deployment details
            </button> 
        )}
            
          
        { showDeploymentDetails && (
            <div className="mt-4 flex flex-col w-full items-center justify-center">
              <p className="uppercase mt-2">Contract Name</p>
              <p className="uppercase text-red-500">{contractInfo?.ContractName ?? '-'}</p>
              <p className="uppercase mt-2">Compiler Version</p>
              <p className="text-red-500">{contractInfo?.CompilerVersion ?? '-'}</p>
              <p className="uppercase mt-2">Runs</p>
              <p className="text-red-500">{contractInfo?.Runs ?? '-'}</p>
              <p className="uppercase mt-2">Optimizations</p>
              <p className="text-red-500">{contractInfo?.OptimizationUsed ?? '-'}</p>
              <p className="uppercase mt-2">License</p>
              <p className="uppercase text-red-500">{contractInfo?.LicenseType ?? '-'}</p>
              <p className="uppercase mt-2">Constructor Args</p>
              <>
                {(constructorArgs ?? []).map(arg => (
                  <>
                    <p className="uppercase mt-2">{arg.name}</p>
                    <p className="uppercase text-red-500">{arg.value}</p>
                  </>
                ))}
              </>
              <p className="uppercase mt-2">SOURCE CODE</p>
              <p><small>{contractInfo?.SourceCode.slice(1).slice(0, -1) ?? ''}</small></p>
            </div>
        )}
        
{/*
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
        </div>*/}
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/jvaleskadevs/superchain-teleporter-station" rel="noopener noreferrer" target="_blank">
         MADE WITH 💜 BY J. VALESKA
        </a>
      </footer>
    </div>
  );
};

export default Home;
