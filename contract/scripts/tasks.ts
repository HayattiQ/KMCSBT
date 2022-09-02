/* eslint-disable dot-notation */
import { task } from 'hardhat/config'
import { getContract, getProvider } from './helpers'
import fs from 'fs'
import type { KMCSelect } from '../typechain-types'
const { parse } = require('csv-parse/sync')

task('airdrop', 'Push WhiteList from JSON file')
  .addOptionalParam(
    'filename',
    'WhiteList txt file name',
    './scripts/KMCS_airdrop.csv'
  )
  .setAction(async (taskArgs, hre) => {
    const contract = (await getContract(
      'KMCSelect',
      hre,
      getProvider(hre)
    )) as KMCSelect
    const records = parse(fs.readFileSync('./scripts/KMCS_airdrop.csv'), {
      columns: true,
    })
    for (const ad of records.filter((e: { rare: number }) => e.rare >= 1)) {
      let loop = true
      let count = 0
      while (loop && count < 3) {
        try {
          const tx = await contract.mint(ad.HolderAddress, 1, ad.rare, '0x00')
          console.log(tx.hash)
          await tx.wait()
          loop = false
        } catch (e) {
          count++
          console.log('error we send again.address = ' + ad.HolderAddress)
          //        console.log(e)
        }
      }
    }
  })
