/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-expressions */
import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { YamakeiVR } from '../typechain-types'
import { expect } from 'chai'

describe(`NFTBoilMerkleA contract`, function () {
  let owner: SignerWithAddress
  let bob: SignerWithAddress
  let alis: SignerWithAddress
  let ad: YamakeiVR

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [owner, bob, alis] = await ethers.getSigners()
    const contract = await ethers.getContractFactory('YamakeiVR')
    ad = (await contract.deploy()) as YamakeiVR
    await ad.deployed()
  })


  describe('Public Minting checks', function () {
    beforeEach(async function () {
      await ad.setPresale(false)
    })

    it('Owner and Bob mint', async () => {
      let tokenId = await ad.totalSupply()
      await expect(
        ad.publicMint(1)
      )
        .to.emit(ad, 'Transfer')
        .withArgs(ethers.constants.AddressZero, owner.address, tokenId)
      expect(await ad.totalSupply()).to.equal(1)

      tokenId = await ad.totalSupply()
      await expect(
        ad.connect(bob).publicMint(1)
      )
        .to.emit(ad, 'Transfer')
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId)

      expect(await ad.totalSupply()).to.equal(2)
    })
  })
})