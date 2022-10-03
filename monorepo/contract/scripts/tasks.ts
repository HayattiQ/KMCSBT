/* eslint-disable dot-notation */
import { task, types } from 'hardhat/config'
import { getContract, getProvider } from './helpers'
import { addresses } from './airdrop_import'
import fs from 'fs'
import { BigNumber } from 'ethers'
import "@nomiclabs/hardhat-ethers";
import type { YamakeiVR } from '../typechain-types'
const { parse } = require('csv-parse/sync')


type CSVColumn = {
  [k: string]: string | number
}


task("batchTransfer", 'test external contract')
  .setAction(async (taskArgs, hre) => {

    const contract = await getContract('YamakeiVR', hre, getProvider(hre)) as YamakeiVR
    for (let i = 55; i <= 98; i++) {
      const tx = await contract['safeTransferFrom(address,address,uint256)'](
        "0x79c3e736445f9eeeCa6467103fBF3b0c924e59e0",
        addresses[i - 55],
        i
      )

      console.log(tx.hash)
      fs.writeFileSync('./scripts/mint.log', tx.hash + '\n', { flag: 'a' })
      await tx.wait()
    }
  })


task('airdrop', 'Push WhiteList from JSON file')
  .addOptionalParam(
    'filename',
    'WhiteList txt file name',
    './scripts/0922.csv'
  )
  .addOptionalParam('index', 'Bulk Send Chunk Index', 100, types.int)
  .addOptionalParam('column', 'Bulk Send amount Column', 'Quantity', types.string)
  .setAction(async (taskArgs, hre) => {
    const contract = await getContract('KMCbadge', hre, getProvider(hre))
    const records: CSVColumn[] = parse(fs.readFileSync(taskArgs.filename), {
      columns: true,
    })
    // const dropList = records.filter((e) => (Number(e[taskArgs.column])) >= 1)
    const dropList = records
    if (dropList.length === 0)
      throw new Error('records have not value. please check column')
    for (let i = 0; i <= dropList.length; i += taskArgs.index) {
      const ad = dropList.slice(i, i + taskArgs.index)
      const tx = await contract['batchMintTo'](
        ad.map((e: CSVColumn) => e['HolderAddress'] as string),
        5,
        ad.map((e: CSVColumn) => BigNumber.from(1)),
        { gasPrice: 80000000000, gasLimit: 8000000 }
      )

      console.log(tx.hash)
      fs.writeFileSync('./scripts/mint.log', tx.hash + '\n', { flag: 'a' })
      await tx.wait()
    }
  })
