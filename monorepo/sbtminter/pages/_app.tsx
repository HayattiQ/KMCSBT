import { WagmiConfig, createClient, configureChains, chain } from 'wagmi'
import type { AppProps } from 'next/app'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import '../styles/globals.css'

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')

export default function App({ Component, pageProps }: AppProps) {
  const { provider, chains, webSocketProvider } = configureChains(
    [chain.polygon],
    [publicProvider()]
  )

  const client = createClient({
    autoConnect: false,
    provider,
    webSocketProvider,
    connectors: [new InjectedConnector({ chains })],
  })
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
