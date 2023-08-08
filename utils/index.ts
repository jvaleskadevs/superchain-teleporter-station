import {
  mainnet,
  sepolia,
  polygonMumbai,
  goerli, polygon,
  zora, 
  zoraTesnet, 
  optimism, 
  optimismGoerli, 
  baseGoerli
} from 'viem/chains';
/**
  *   This helps us building the endpoints for the different chains,
  *   we are leveraging the contracts endpoints of the Etherscan APIs
  */
export const buildEndpoint = (endpoint: string, contract: string, chain: string) => {
  if (endpoint === 'contract') {
    if (chain === '1') {
      return `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;
    } else if (chain === '5') {
      return `https://api-goerli.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '137') {
      return `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;    
    } else if (chain === '420') {
      return `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '80001') {
      return `https://api-testnet.polygonscan.com/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;
    } else if (chain === '7777777') {
      return `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '') {
      return `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    }
  } else if (endpoint === 'creation') {
    if (chain === '1') {
      return `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;
    } else if (chain === '5') {
      return `https://api-goerli.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '137') {
      return `https://api.polygonscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;    
    } else if (chain === '420') {
      return `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '80001') {
      return `https://api-testnet.polygonscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;
    } else if (chain === '7777777') {
      return `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '') {
      return `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    }    
  } else if (endpoint === 'verification') {
    if (chain === '1') {
      return `https://api.etherscan.io/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;
    } else if (chain === '5') {
      return `https://api-goerli.etherscan.io/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '137') {
      return `https://api.polygonscan.com/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;    
    } else if (chain === '420') {
      return `https://api.etherscan.io/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '80001') {
      return `https://api-testnet.polygonscan.com/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN}`;
    } else if (chain === '7777777') {
      return `https://api.etherscan.io/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    } else if (chain === '') {
      return `https://api.etherscan.io/api?module=contract&action=verifysourcecode&contractaddress=${contract}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`;    
    }    
  }
}

export const buildVerificationData = (contractInfo, constructorArgs) => {
  return `
    &sourceCode=${contractInfo.sourceCode}
    &contractname=${contractInfo.contractName}
    &codeformat=solidity-single-file
    &compilerversion=${contractInfo.CompilerVersion}
    &optimizationUsed=${contractInfo.OptimizationUsed}
    &runs=${contractInfo.Runs}
    &constructorArguments=${constructorArgs}
    &evmversion=${contractInfo.EVMVersion}
    &licenseType=${contractInfo.LicenseType}
    &libraryname1=
    &libraryaddress1=
    &libraryname2=
    &libraryaddress2=
    &libraryname3=
    &libraryaddress3=
    &libraryname4=
    &libraryaddress4=
    &libraryname5=
    &libraryaddress5=
    &libraryname6=
    &libraryaddress6=
    &libraryname7=
    &libraryaddress7=
    &libraryname8=
    &libraryaddress8=
    &libraryname9=
    &libraryaddress9=
    &libraryname10=
    &libraryaddress10=
  `;
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
    case 137:
      return polygon;
    case 80001:
      return polygonMumbai;
    case 7777777:
      return zora;
    case 28528:
      return optimismGoerli;
    case 420:
      return optimismGoerli;
    case 84531:
      return baseGoerli;
    case 58008:
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
