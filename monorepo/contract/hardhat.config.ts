/* eslint-disable dot-notation */
import 'dotenv/config'
import type { HardhatUserConfig } from 'hardhat/config'
import { getEnvVariable } from './scripts/helpers'
import '@nomiclabs/hardhat-etherscan'
import './scripts/tasks'

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env['BSCSCAN_API'] || '',
      bscTestnet: process.env['BSCSCAN_API'] || '',
      polygon: process.env['POLYGON_API'] || '',
      polygonMumbai: process.env['POLYGON_API'] || '',
      mainnet: process.env['ETH_API'] || '',
      goerli: process.env['ETH_API'] || '',
      rinkeby: process.env['ETH_API'] || '',
    },
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      chainId: 5,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    ethereum: {
      url: process.env['MAINNET_RPC'] || '',
      chainId: 1,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    rinkeby: {
      url: process.env['RINKEBY_RPC'] || '',
      chainId: 4,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    polygon: {
      url: 'https://polygon-mainnet.g.alchemy.com/v2/RigxyhOQZ5s7cqzT8tPLakU8rod6Y-5e',
      chainId: 137,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    astar: {
      url: 'https://rpc.astar.network:8545',
      chainId: 592,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
    shibuya: {
      url: 'https://rpc.shibuya.astar.network:8545',
      chainId: 81,
      accounts: [getEnvVariable('ACCOUNT_PRIVATE_KEY')],
    },
  },
}

export default config
