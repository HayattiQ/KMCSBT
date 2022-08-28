import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoading, Oval } from '@agney/react-loading'
import { connect } from './redux/blockchain/blockchainActions'
import { fetchData } from './redux/data/dataActions'
import * as s from './styles/globalStyles'
import styled from 'styled-components'
import BN from 'bn.js'

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input

export const StyledButton = styled.button`
  padding: 16px 40px;
  border: none;
  background-color: ${(props) => (props.disabled ? '#505050' : '#48e1af')};
  font-weight: bold;
  color: var(--secondary-text);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: black;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`

export const ResponsiveWrapper = styled.div`
  max-width: 500px;
  min-width: 300px;
  justify-content: stretched;
  align-items: stretched;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`

export const BuyButtonContent = styled.div`
  display: flex;
  align-items: center;
`

const Mint = () => {
  const dispatch = useDispatch()
  const blockchain = useSelector((state) => state.blockchain)
  const data = useSelector((state) => state.data)
  const [claimingNft, setClaimingNft] = useState(false)
  const [merkle, setMerkle] = useState([])
  const [feedback, setFeedback] = useState()
  const [mintAmount, setMintAmount] = useState(1)
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
  })

  const { indicatorEl } = useLoading({
    loading: claimingNft,
    indicator: <Oval width="24" />,
  })

  const claimNFTs = () => {
    let method = null
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`)
    setClaimingNft(true)
    method = blockchain.smartContract.methods.preMint(
      mintAmount,
      merkle.presaleMax,
      merkle.hexProof
    )
    method
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once('error', (err) => {
        console.log(err)
        setFeedback('Sorry, something went wrong please try again later.')
        setClaimingNft(false)
      })
      .then((receipt) => {
        console.log(receipt)
        setFeedback(
          <React.Fragment>
            <div style={{ color: 'var(--secondary)' }}>
              You successfully minted NFT
            </div>
            <div>
              <a
                target={'_blank'}
                style={{ color: 'var(--secondary)' }}
                href={'https://opensea.io/collection/wastestinnyc'}
              >
                https://opensea.io/collection/wastestinnyc
              </a>
            </div>
          </React.Fragment>
        )

        setClaimingNft(false)
        dispatch(fetchData(blockchain.account))
      })
  }

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1
    if (newMintAmount < 1) {
      newMintAmount = 1
    }
    setMintAmount(newMintAmount)
  }

  const incrementMintAmount = () => {
    const MAX_MINT_AMOUNT = merkle.presaleMax
    let newMintAmount = mintAmount + 1
    if (newMintAmount > MAX_MINT_AMOUNT) {
      newMintAmount = MAX_MINT_AMOUNT
    }
    setMintAmount(newMintAmount)
  }

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account))
    }
  }

  const getMerkleData = (account) => {
    fetch('/.netlify/functions/merkletree?address=' + account)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result)
          setMerkle(result)
        },
        (error) => {
          console.log(error)
        }
      )
      .catch((error) => {
        console.error('通信に失敗しました', error)
      })
  }

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    const config = await configResponse.json()
    SET_CONFIG(config)
  }

  useEffect(() => {
    getConfig()
  }, [])

  useEffect(() => {
    getData()
    if (blockchain.account) {
      getMerkleData(blockchain.account)
    }
  }, [blockchain.account])

  const BeforeConnect = () => {
    return (
      <s.Container ai={'center'} jc={'center'}>
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'var(--accent-text)',
          }}
        >
          Connect to the {CONFIG.NETWORK.NAME} network
        </s.TextDescription>
        <s.SpacerSmall />
        <StyledButton
          onClick={(e) => {
            e.preventDefault()
            dispatch(connect())
            getData()
          }}
        >
          CONNECT
        </StyledButton>
        {blockchain.errorMsg !== '' ? (
          <>
            <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
              }}
            >
              {blockchain.errorMsg}
            </s.TextDescription>
          </>
        ) : null}
      </s.Container>
    )
  }

  const BuyButton = () => {
    if (!merkle['hexProof']) {
      return (
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'var(--accent-text)',
          }}
        >
          Your address is not allow listed
        </s.TextDescription>
      )
    }
    return (
      <StyledButton
        disabled={claimingNft ? 1 : 0}
        onClick={(e) => {
          e.preventDefault()
          claimNFTs()
          getData()
        }}
      >
        <BuyButtonContent>{claimingNft ? indicatorEl : 'BUY'}</BuyButtonContent>
      </StyledButton>
    )
  }

  const AftarConnect = () => {
    return (
      <>
        <s.TextDescription
          style={{ textAlign: 'center', color: 'var(--accent-text)' }}
        >
          MINT LIVE!
        </s.TextDescription>
        <s.SpacerSmall />
        {data.presale && (
          <s.TextTitle
            style={{
              textAlign: 'center',
              color: 'var(--accent-text)',
            }}
          >
            You can mint {merkle.presaleMax} NFT
          </s.TextTitle>
        )}
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'var(--accent-text)',
          }}
        >
          {feedback}
        </s.TextDescription>
        <s.SpacerMedium />
        <s.Container ai={'center'} jc={'center'} fd={'row'}>
          <StyledRoundButton
            style={{ lineHeight: 0.4 }}
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault()
              decrementMintAmount()
            }}
          >
            -
          </StyledRoundButton>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: 'center',
              color: 'var(--accent-text)',
            }}
          >
            {mintAmount}
          </s.TextDescription>
          <s.SpacerMedium />
          <StyledRoundButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault()
              incrementMintAmount()
            }}
          >
            +
          </StyledRoundButton>
        </s.Container>
        <s.SpacerSmall />
        <s.Container ai={'center'} jc={'center'} fd={'row'}>
          {!data.paused ? (
            data.mintable ? (
              <BuyButton />
            ) : (
              <div style={{ color: 'white' }}>Loading</div>
            )
          ) : (
            <div style={{ color: 'white' }}>Mint is paused</div>
          )}
        </s.Container>
      </>
    )
  }

  const MintButton = () => {
    return (
      <React.Fragment>
        <s.SpacerXSmall />
        {blockchain.account === '' || blockchain.smartContract === null ? (
          <BeforeConnect />
        ) : (
          <AftarConnect />
        )}
      </React.Fragment>
    )
  }

  return (
    <ResponsiveWrapper style={{ padding: 24 }} test>
      <s.Container
        flex={2}
        jc={'center'}
        ai={'center'}
        style={{
          backgroundColor: 'rgba(2,30,11,0.7)',
          padding: 24,
          borderRadius: 24,
          border: '0px dashed var(--secondary)',
        }}
      >
        <s.TextTitle
          style={{
            textAlign: 'center',
            color: 'white',
          }}
        >
          Mint Date: 8/31 19:00 - 21:00 <br />
          WhiteList Mint Only
        </s.TextTitle>
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'white',
          }}
        >
          <StyledLink
            style={{ color: 'white' }}
            target={'_blank'}
            href={CONFIG.SCAN_LINK}
          >
            {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
          </StyledLink>
        </s.TextDescription>
        <s.SpacerSmall />
        {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
          <s.TextTitle
            style={{ textAlign: 'center', color: 'var(--accent-text)' }}
          >
            The sale has ended.
          </s.TextTitle>
        ) : (
          <MintButton config={CONFIG} />
        )}
        <s.SpacerMedium />
        <s.TextDescription
          style={{ textAlign: 'center', color: 'var(--accent-text)' }}
        >
          NFT Marketplace
        </s.TextDescription>
        <StyledLink target={'_blank'} href={CONFIG.MARKETPLACE_LINK}>
          {CONFIG.MARKETPLACE}
        </StyledLink>
      </s.Container>
      <s.SpacerLarge />
      <s.Container>
        <s.TextDescription
          style={{
            textAlign: 'center',
            color: 'black',
          }}
        >
          Please make sure you are connected to the right network (
          {CONFIG.NETWORK.NAME}) and the correct address. Please note: Once you
          make the purchase, you cannot undo this action!
        </s.TextDescription>
        <s.SpacerLarge />
      </s.Container>
    </ResponsiveWrapper>
  )
}

export default Mint
