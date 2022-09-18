import type { AppProps } from 'next/app'
import { chain, configureChains, createClient } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { Web3ModalEthereum } from '@web3modal/ethereum'
import type { ConfigOptions } from '@web3modal/react'
import { Web3ModalProvider } from '@web3modal/react'

// Get Your projectId at https://cloud.walletconnect.com
const WC_PROJECT_ID = '4c3254ea8566374e9981f957795a34d0'

// Configure chains and providers (rpc's)
const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()]
)

// Create wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: Web3ModalEthereum.defaultConnectors({
    chains,
    appName: 'web3Modal',
  }),
  provider,
})

// Configure web3modal
const modalConfig: ConfigOptions = {
  projectId: WC_PROJECT_ID,
  theme: 'dark',
  accentColor: 'orange',
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ModalProvider config={modalConfig} ethereumClient={wagmiClient}>
      <Component {...pageProps} />
    </Web3ModalProvider>
  )
}

export default MyApp
