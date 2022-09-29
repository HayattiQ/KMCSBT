import { WagmiConfig, createClient, configureChains, chain } from 'wagmi'
import type { AppProps } from 'next/app'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import '../styles/globals.css'

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
