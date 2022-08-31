/* eslint-disable no-unused-expressions */
import { ethers } from 'hardhat'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { testConfig } from './test-helpers'
import type { KMCSelect } from '../typechain-types'
const { expect } = require('chai')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

describe(`${testConfig.contract_name} contract`, function () {
  let owner: SignerWithAddress
  let bob: SignerWithAddress
  let alis: SignerWithAddress
  let ad: KMCSelect

  beforeEach(async function () {
    // @ts-ignore
    ;[owner, bob, alis] = await ethers.getSigners()
    const contract = await ethers.getContractFactory(testConfig.contract_name)
    ad = (await contract.deploy()) as KMCSelect
    await ad.deployed()
  })

  describe('Whitelist checks', function () {
    let rootTree
    let hexProofs: any[]
    beforeEach(async function () {
      const leaves = [
        { address: bob.address, max: 2 },
        { address: alis.address, max: 3 },
      ].map((x) =>
        ethers.utils.solidityKeccak256(
          ['address', 'uint256'],
          [x.address, x.max]
        )
      )
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
      rootTree = tree.getRoot()
      await ad.setMerkleRoot(rootTree)
      hexProofs = [
        { address: bob.address, max: 2 },
        { address: alis.address, max: 3 },
      ].map((x) =>
        tree.getHexProof(
          ethers.utils.solidityKeccak256(
            ['address', 'uint256'],
            [x.address, x.max]
          )
        )
      )
    })
    it('PreSale function token emit test', async function () {
      expect(await ad.connect(alis).preMint(1, 3, hexProofs[1])).to.emit(
        ad,
        'Transfer'
      )
    })
    it('Non Whitelisted user cant buy on PreSale', async function () {
      await expect(ad.connect(bob).preMint(1, 2, hexProofs[0])).to.be.ok

      await expect(
        ad.connect(owner).preMint(1, 1, hexProofs[0])
      ).to.be.revertedWith('Invalid Merkle Proof')

      expect(await ad.connect(alis).preMint(1, 3, hexProofs[1])).to.be.ok
    })

    it(`Whitelisted user can only buy specific nft`, async function () {
      expect(await ad.connect(alis).preMint(3, 3, hexProofs[1])).to.be.ok
      await expect(
        ad.connect(alis).preMint(1, 3, hexProofs[1])
      ).to.be.revertedWith('Already claimed max')
    })

    it('Whitelisted user can buy 1 + 2', async function () {
      expect(await ad.connect(bob).preMint(1, 2, hexProofs[0])).to.be.ok
      expect(await ad.connect(bob).preMint(1, 2, hexProofs[0])).to.be.ok
      await expect(
        ad.connect(bob).preMint(1, 2, hexProofs[0])
      ).to.be.revertedWith('Already claimed max')
    })

    it('Whitelisted fails to mints when paused', async () => {
      await ad.pause()

      await expect(
        ad.connect(alis).preMint(1, 3, hexProofs[1])
      ).to.revertedWith('Pausable: paused')
      await ad.unpause()
      expect(await ad.connect(bob).preMint(1, 2, hexProofs[0])).to.be.ok
    })

    it('Non WhiteList user block after Whitelisted user buy', async function () {
      expect(await ad.connect(bob).preMint(1, 2, hexProofs[0])).to.be.ok
      await expect(
        ad.connect(bob).preMint(2, 2, hexProofs[0])
      ).to.be.revertedWith('Already claimed max')
      await expect(
        ad.connect(owner).preMint(1, 2, hexProofs[0])
      ).to.be.revertedWith('Invalid Merkle Proof')
    })
  })
})
