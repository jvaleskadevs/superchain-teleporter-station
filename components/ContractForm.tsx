import { useState } from "react";

interface Props {
  onSubmit: (
    contractAddress: `0x${string}`, 
    fromChainId: string,
    toChainId: string,
  ) => void;
}

export default function ContractForm({ onSubmit }: Props) {
  const [contractAddress, setContractAddress] = useState<`0x${string}`>('');
  const [fromChainId, setFromChainId] = useState<string>('1');
  const [toChainId, setToChainId] = useState<string>('420');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (contractAddress) {
      onSubmit(contractAddress, fromChainId, toChainId);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control w-full max-w-xs">
        <h2>Contract Details</h2>
        <label className="label" htmlFor="fromChainId">
          <span className="label-text">Select origen blockchain</span>
        </label>
        <select
          id="fromChainId"
          className="input input-bordered w-full max-w-x"
          onChange={(e) => setFromChainId(e.target.value)}
          value={fromChainId}
        >
          <option value="1">Ethereum Mainnet</option>
          <option value="5">Ethereum Goerli</option>
          <option value="137">Polygon PoS</option>
          <option value="80001">Polygon Mumbai</option>
          <option value="">Optimism Mainnet</option>
          <option value="420">Optimism Goerli</option>
          <option value="7777777">Zora Mainnet</option>
          <option value="">Zora Testnet</option>
          <option value="">Base Goerli</option>
        </select>
        
        <label className="label" htmlFor="toChainId">
          <span className="label-text">Select destination blockchain</span>
        </label>
        <select
          id="toChainId"
          className="input input-bordered w-full max-w-x"
          onChange={(e) => setToChainId(e.target.value)}
          value={toChainId}
        >
          <option value="1">Ethereum Mainnet</option>
          <option value="5">Ethereum Goerli</option>
          <option value="137">Polygon PoS</option>
          <option value="80001">Polygon Mumbai</option>
          <option value="">Optimism Mainnet</option>
          <option defaultValue value="420">Optimism Goerli</option>
          <option value="7777777">Zora Mainnet</option>
          <option value="">Zora Testnet</option>
          <option value="">Base Goerli</option>
        </select>
        
        <label className="label" htmlFor="contractAddress">
          <span className="label-text">Enter contract address to be teleported</span>
        </label>    
        <input
          type="text"
          id="contractAddress"
          placeholder="0x..."
          className="input input-bordered w-full max-w-x"
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-wide">
        Continue
      </button>
    </form>
  );
}
