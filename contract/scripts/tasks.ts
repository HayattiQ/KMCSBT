/* eslint-disable dot-notation */
import { task, types } from 'hardhat/config'
import { getContract, getProvider } from './helpers'
import fs from 'fs'
import type { KMCbadge } from '../typechain-types'
import { BigNumber } from 'ethers'
const { parse } = require('csv-parse/sync')

task('airdrop', 'Push WhiteList from JSON file')
  .addOptionalParam(
    'filename',
    'WhiteList txt file name',
    './scripts/KMCHolder.csv'
  )
  .addOptionalParam('index', 'Bulk Send Chunk Index', 200, types.int)
  .addOptionalParam(
    'column',
    'Bulk Send amount Column',
    'holder10',
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    type CSVColumn = {
      [k: string]: string | number
    }

    const contract = (await getContract(
      'KMCbadge',
      hre,
      getProvider(hre)
    )) as KMCbadge
    const records: CSVColumn[] = parse(fs.readFileSync(taskArgs.filename), {
      columns: true,
    })
    const dropList = records.filter((e) => (e[taskArgs.column] as number) >= 1)
    if (dropList.length === 0)
      throw new Error('records have not value. please check column')
    for (let i = 0; i <= dropList.length; i += taskArgs.index) {
      const ad = dropList.slice(i, i + taskArgs.index)
      const tx = await contract.batchMintTo(
        ad.map((e: CSVColumn) => e['HolderAddress'] as string),
        0,
        ad.map((e: CSVColumn) => BigNumber.from(e[taskArgs.column] as number))
      )

      console.log(tx.hash)
      fs.writeFileSync('./scripts/mint.log', tx.hash + '\n', { flag: 'a' })
      await tx.wait()
    }
  })
