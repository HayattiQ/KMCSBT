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
  let charlie: SignerWithAddress
  let ad: YamakeiVR

  beforeEach(async function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [owner, bob, alis, charlie] = await ethers.getSigners()
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

    it('AdminLock can lock other peoples token', async () => {
      await ad.connect(bob).publicMint(1)
      expect(await ad.totalSupply()).to.equal(1)

      await ad.adminLock(owner.address, [0])
      expect(await ad.getLocked(0)).to.equal(owner.address)
      await expect(ad.connect(bob).transferFrom(bob.address, alis.address, 0)).to.be.revertedWith("LOCKED")

      await ad.adminLock(ethers.constants.AddressZero, [0])
      await ad.connect(bob).transferFrom(bob.address, alis.address, 0)
      expect(await ad.ownerOf(0)).to.equal(alis.address);
    })

    it('AdminLock token number check', async () => {
      await ad.connect(bob).publicMint(1)
      await ad.connect(alis).publicMint(1)
      await ad.connect(bob).publicMint(1)
      await ad.connect(alis).publicMint(1)
      expect(await ad.ownerOf(3)).to.equal(alis.address);

      await ad.adminLock(owner.address, [1, 2])

      await ad.connect(bob).transferFrom(bob.address, charlie.address, 0)
      await expect(ad.connect(alis).transferFrom(alis.address, charlie.address, 1)).to.be.revertedWith("LOCKED")
      await expect(ad.connect(bob).transferFrom(bob.address, charlie.address, 2)).to.be.revertedWith("LOCKED")
      await ad.connect(alis).transferFrom(alis.address, charlie.address, 3)

      expect(await ad.ownerOf(0)).to.equal(charlie.address);
      expect(await ad.ownerOf(1)).to.equal(alis.address);
      expect(await ad.ownerOf(2)).to.equal(bob.address);
      expect(await ad.ownerOf(3)).to.equal(charlie.address);

    })

    it('Unlocker can transfer', async () => {
      await ad.connect(bob).publicMint(1)
      await ad.adminLock(bob.address, [0])
      await ad.connect(bob).transferFrom(bob.address, charlie.address, 0)
      expect(await ad.ownerOf(0)).to.equal(charlie.address);
    })

  })
})