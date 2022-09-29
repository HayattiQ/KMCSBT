import {
  useAccount,
  useConnect,
  useDisconnect,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import MinterABI from '../public/config/abi.json'

export default function Connect() {
  const { isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { config, error } = usePrepareContractWrite({
    chainId: 137,
    addressOrName: '0xdBFB39FFd1B98dda59326E625be10Aa6ACC34d22',
    contractInterface: MinterABI,
    functionName: 'mint',
  })
  const { write } = useContractWrite(config)

  function MintButton() {
    if (error) {
      console.log(error)
      return (
        <>
          <h1>Error is occured</h1>
        </>
      )
    } else {
      return (
        <button
          disabled={!write}
          className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2"
          onClick={() => write?.()}
        >
          Mint SBT
        </button>
      )
    }
  }

  if (isConnected)
    return (
      <div>
        <MintButton />

        <button
          className="bg-gray-500 hover:bg-gray-400 text-white rounded px-4 py-2"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    )
  return (
    <button
      className="bg-blue-900 hover:bg-blue-800 text-white rounded px-4 py-2"
      onClick={() => connect({ chainId: 137 })}
    >
      Connect Wallet
    </button>
  )
}
