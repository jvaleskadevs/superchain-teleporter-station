import {
  mainnet,
  sepolia,
  polygonMumbai,
  goerli,
  polygon,
  zora, 
  zoraTestnet, 
  optimism, 
  optimismGoerli, 
  baseGoerli,
  //base,
  Chain
} from 'viem/chains';
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
/**
  *   This helps us building the endpoints for the different chains,
  *   we are leveraging the contracts endpoints of the Etherscan/Blockscout RPC APIs
  */
export const buildEndpoint = (endpoint: string, contract: string, chainId: string) => {
  let scan;
  let key;
  switch(parseInt(chainId)) {
    case 1:
      scan = 'api.etherscan.io';
      key = process.env.NEXT_PUBLIC_ETHERSCAN;
      break;
    case 5:
      scan = 'api-goerli.etherscan.io';
      key = process.env.NEXT_PUBLIC_ETHERSCAN;
      break;
    case 10:
      scan = 'api-optimistic.etherscan.io';
      key = process.env.NEXT_PUBLIC_OPSCAN;
      break;
    case 137:
      scan = 'api.polygonscan.com';
      key = process.env.NEXT_PUBLIC_POLYGONSCAN;
      break;
    case 420:
      scan = 'api-goerli-optimistic.etherscan.io';
      key = process.env.NEXT_PUBLIC_OPSCAN;
      break;   
    case 919:
      scan = 'sepolia.explorer.mode.network';
      key = process.env.NEXT_PUBLIC_MODESCAN;
      break; 
    case 999:
      scan = 'testnet.explorer.zora.energy';
      key = process.env.NEXT_PUBLIC_ZORASCAN;
      break; 
/*      
    case 8453:
      scan = 'api.basescan.org';
      key = process.env.NEXT_PUBLIC_BASESCAN;
      break;
*/
    case 80001:
      scan = 'api-testnet.polygonscan.com';
      key = process.env.NEXT_PUBLIC_POLYGONSCAN;
      break;
    case 84531:
      scan = 'api-goerli.basescan.org';
      key = process.env.NEXT_PUBLIC_BASESCAN;
      break;
    case 7777777:
      scan = 'explorer.zora.energy';
      key = process.env.NEXT_PUBLIC_ZORASCAN;
      break;
    case 11155111:
      scan = 'api-sepolia.etherscan.io';
      key = process.env.NEXT_PUBLIC_ETHERSCAN;
      break;
    default:
      scan = 'api-sepolia.etherscan.io';
      key = process.env.NEXT_PUBLIC_ETHERSCAN;      
      break;
  }
  let params;
  if (endpoint === 'contract') {
    params = 'api?module=contract&action=getsourcecode&address=';
  } else if (endpoint === 'creation') {
    params = 'api?module=contract&action=getcontractcreation&contractaddresses=';
  } else if (endpoint === 'verify') {
    params = 'api?module=contract&action=verifysourcecode&contractaddress=';
  } else if (endpoint === 'status-verify') {
    params = 'api?module=contract&action=checkverifystatus&guid=';
  }
  
  return `https://${scan}/${params}${contract}&apikey=${key}`;
}

export const buildVerificationData = (contractInfo, constructorArgs) => {
  let sourceCode;
  let contractName;
  let codeFormat;
  if (contractInfo.SourceCode.startsWith('{{')) {
    codeFormat = 'solidity-standard-json-input';
    sourceCode = contractInfo.SourceCode.slice(1).slice(0, -1);
    console.log(sourceCode);
    Object.entries(JSON.parse(sourceCode)?.sources).forEach(([key, _]) => {
      if (key.includes(`/${contractInfo.ContractName}.sol`)) {
        contractName = `${key}:${contractInfo.ContractName}`;
      };
    });
  } else {
    codeFormat = 'solidity-single-file';
    sourceCode = contractInfo.SourceCode.replace(/\+/g, '%2B');
    contractName = contractInfo.ContractName;
  }
  return `&sourceCode=${sourceCode}&contractname=${contractName}&codeformat=${codeFormat}&compilerversion=${contractInfo.CompilerVersion.replace(/\+/g, '%2B')}&optimizationUsed=${contractInfo.OptimizationUsed}&runs=${contractInfo.Runs}&constructorArguments=${constructorArgs.replace('0x', '')}&evmversion=${contractInfo.EVMVersion}&licenseType=${contractInfo.LicenseType}&libraryname1=&libraryaddress1=&libraryname2=&libraryaddress2=&libraryname3=&libraryaddress3=&libraryname4=&libraryaddress4=&libraryname5=&libraryaddress5=&libraryname6=&libraryaddress6=&libraryname7=&libraryaddress7=&libraryname8=&libraryaddress8=&libraryname9=&libraryaddress9=&libraryname10=&libraryaddress10=`;
}

/**
  *   This helps us parsing chainId to wagmi/viem chains
  */
export const getChain = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 5:
      return goerli;
    case 10:
      return optimism;
    case 137:
      return polygon;
    case 420:
      return optimismGoerli;
    case 919:
      return modeTestnet;
    case 999:
      return zoraTestnet;
/*
    case 8453:
      return base;
*/
    case 80001:
      return polygonMumbai;
    case 84531:
      return baseGoerli;
    case 7777777:
      return zora;
    case 11155111:
      return sepolia;
    default:
      return sepolia; 
  }
}
/**
  *   This returns false when the contract code is not verified
  */
export const isVerified = (abi) => {
  return abi !== "Contract source code not verified";
}
/**
  *   This helps us parsing contract functions from the ABI
  */
export const parseAbi = (abi) => {
  let parsedAbi = {};
  abi.forEach((abiItem) => {
    if (abiItem.type !== 'event') {
      const key = parseAbiItemKey(abiItem);
      if (key) {
        parsedAbi[key] = parseAbiItem(abiItem);
      } 
    }
  });
  console.log(parsedAbi);
  return parsedAbi;
}

const parseAbiItemKey = (abiItem) => {
  const inputs = abiItem.inputs || [];
  const inputsString = inputs.map(parseInput).join(',');
  return abiItem.type === 'constructor' 
    ? abiItem.type 
    : `${abiItem.name}(${inputsString})`;
}

const parseInput = (input) => {
  if (input.type.includes('tuple')) {
    const args = (input.components || []).map(parseInput).join(',');
    return input.type.includes('tuple[]') ? `(${args})[]` : `(${args})`;
  }
  return input.type;
}

const parseAbiItem = (abiItem) => {
  if (!abiItem) return abiItem;
  return {
    ...abiItem,
    inputs: (abiItem.inputs || []).map((input: any) => {
      return {
        ...input,
        type: isStruct(input) ? parseStruct(input) : input.type,
        originalType: input.type
      }
    })
  }
}

const isStruct = (input) => {
  return input ? (input.type || "").includes('tuple') : false;
}

const parseStruct = (input) => {
  const args = (input.components || []).map((arg) => {
    return isStruct(arg) ? parseStruct(arg) : arg.type;
  });
  return input.type.endsWith('[]') 
    ? `tuple(${args.join(',')})[]` 
    : `tuple(${args.join(',')})`;
}
