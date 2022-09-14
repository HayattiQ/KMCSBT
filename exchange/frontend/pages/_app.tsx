import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai

function MyApp({ Component, pageProps }: AppProps) {
  ;<ThirdwebProvider desiredChainId={activeChainId}>
    return <Component {...pageProps} />
  </ThirdwebProvider>
}

export default MyApp
