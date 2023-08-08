import { useState } from "react";

interface Props {
  params: Array<any>;
  onSubmit: (args: Array<any>) => void;
}

export default function ConstructorArgsForm({ params, onSubmit }: Props) {
  const [args, setArgs] = useState<Array<any>>(params);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(args);
    if (args.length > 0) {
      console.log(args);
      onSubmit(args);
    }
  }
  
  const onArgsChange = (param, value, idx) => {
    const prevArgs = args;
    prevArgs[idx] = {...param, value };
    setArgs([...prevArgs]);
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control w-full max-w-xs">
        <h2>Constructor Arguments</h2>
        { (params ?? []).map((param, idx) => (      
            <div key={param.name}>  
              <label className="label" htmlFor={param.name}>
                <span className="label-text">{param.name}</span>
              </label>
              <input
                type="text"
                id={param.name}
                className="input input-bordered w-full max-w-x"
                onChange={(e) => onArgsChange(param, e.target.value, idx)}
              />
            </div>
          ))}
      </div>
      <button type="submit" className="btn btn-primary btn-wide">
        Teleport
      </button>
    </form>
  );
}
