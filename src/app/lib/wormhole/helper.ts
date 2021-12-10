import axios from 'axios'
import { Connection, Transaction } from '@solana/web3.js'
import { getSignedVAA, parseSequenceFromLogEth, getEmitterAddressEth, CHAIN_ID_ETH, CHAIN_ID_SOLANA,  } from '@certusone/wormhole-sdk'

import { account, WalletInterface, utils } from '@senswap/sen-js'
import { TokenEtherInfo, TransactionEtherInfo } from 'app/model/wormhole.controller'
import WohEthSol from './wohEthSol'
import { asyncWait } from 'shared/util'
import storage from 'shared/storage'
import PDB from 'shared/pdb'
import { WormholeStoreKey, TransferState, TransferData, StepTransfer } from './constant/wormhole'
import { MORALIS_INFO, ETH_TOKEN_BRIDGE_ADDRESS } from './constant/ethConfig'
import { web3 } from '../etherWallet/web3Config'
import ABI from './abi.json'
import { createEtherSolContext } from './context'

const abiDecoder = require('abi-decoder')

export const getSignedVAAWithRetry = async (
  ...args: Parameters<typeof getSignedVAA>
) => {
  let attempts = 0
  while (true) {
    try {
      await asyncWait(10000)
      console.log('Retry to get signed vaa:', ++attempts)
      const re = await getSignedVAA(...args)
      return re
    } catch (er) {
      // Nothing
    }
  }
}

export const getSolNetwork = () => {
  const solNetwork = storage.get('network') || 'mainnet'
  return solNetwork
}

export const getEtherNetwork = () => {
  const solNetwork = getSolNetwork()
  const etherNetwork = solNetwork === 'mainnet' ? 'mainnet' : 'goerli'
  return etherNetwork
}

export const fetchTokenEther = async (
  address: string,
  networkName: string,
): Promise<TokenEtherInfo[]> => {
  if (networkName === 'mainnet') networkName = 'eth'
  const tokens = []
  const { data } = await axios({
    method: 'get',
    url: `${MORALIS_INFO.url}/${address}/erc20?chain=${networkName}`,
    headers: {
      'X-API-Key': MORALIS_INFO.apiKey,
    },
  })
  for (const token of data) {
    token.decimals = Number(token.decimals)
    token.balance = BigInt(token.balance)
    token.amount = utils.undecimalize(token.balance, token.decimals)
    token.address = token.token_address
    tokens.push(token)
  }
  return tokens
}

export const fetchTransactionsAAddress = async (
  address: string,
  networkName: string,
) : Promise<TransferState[]> => {
  if (networkName === 'mainnet') networkName = 'eth'

  // Get ABI token
  // const abi = await axios({
  //   method: 'get',
  //   url: `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc&apikey=H7IQG6XU3FAV5MVCVJC7WD2RVSXX5DPJP8`,
  // })

  const listTransferState = await WohEthSol.fetchAll()

  abiDecoder.addABI(ABI)

  const tokens:TransferState[] = []
  const { data} = await axios({
    method: 'get',
    url: `${MORALIS_INFO.url}/${address}?chain=${networkName}`,
    headers: {
      'X-API-Key': MORALIS_INFO.apiKey,
    },
  })

  let calledTokens:Record<string, TokenEtherInfo> = {}

  for (const token of data.result as TransactionEtherInfo[]) {
    if (token.to_address === ETH_TOKEN_BRIDGE_ADDRESS.goerli) {
      token.input = abiDecoder.decodeMethod(token.input)
      let tokenInfo = calledTokens[`${token.input.params[0].value}`]
      if (!tokenInfo) {
        tokenInfo = await fetchInfoAToken(token.input.params[0].value, networkName)
        calledTokens[`${token.input.params[0].value}`] = tokenInfo
      }
      if( Number(token.input.params[2].value) === CHAIN_ID_SOLANA){
        const context = createEtherSolContext(tokenInfo)
        const value = await web3.eth
          .getTransactionReceipt(
            token.hash,
          )
        const sequence = parseSequenceFromLogEth(
          value,
          context.srcBridgeAddress,
        )
        const transferData:TransferData = {
          nextStep: getNextStep(Object.values(listTransferState), value.transactionHash),
          amount: utils.undecimalize(BigInt(token.input.params[1].value), tokenInfo.decimals),
          from: address,
          to: '',
          emitterAddress: getEmitterAddressEth(context.srcTokenBridgeAddress),
          sequence: sequence,
          vaaHex: '',
          txId: '',
          txHash: value.transactionHash,
        }

        tokens.push({
          context: context,
          transferData: transferData,

        })
      }
    }
  }
  return tokens
}

export const getNextStep = (
  data: TransferState[],
  txHash: string
) => {
  for (let item of data) {
    if (txHash === item.transferData.txHash) {
      return item.transferData.nextStep
    }
  }
  return StepTransfer.Unknown
}

export const fetchInfoAToken = async (
  address: string,
  networkName: string,
): Promise<TokenEtherInfo> => {
  const {data}  = await axios({
    method: 'get',
    url: `${MORALIS_INFO.url}/erc20/metadata?chain=${networkName}&addresses=${address}`,
    headers: {
      'X-API-Key': MORALIS_INFO.apiKey,
    },
  })

  return {
    balance: '',
    decimals: data[0]?.decimals,
    logo: data[0]?.logo,
    name: data[0]?.name,
    symbol: data[0]?.symbol,
    thumbnail: data[0]?.thumbnail,
    address: data[0]?.address,
    amount: data[0]?.amount
  }
}

export const sendTransaction = async (
  transaction: Transaction,
  connection: Connection,
): Promise<string> => {
  const tx = transaction.serialize()
  const txId = await connection.sendRawTransaction(tx, {
    skipPreflight: true,
    preflightCommitment: 'confirmed',
  })
  const {
    value: { err },
  } = await connection.confirmTransaction(txId, 'confirmed')
  if (err) throw new Error(`${err} at ${txId}`)
  return txId
}

export const getAssociatedAddress = async (
  mintAddress: string,
  wallet: WalletInterface,
) => {
  if (!account.isAddress(mintAddress)) throw new Error('Invalid mint address')
  const walletAddress = await wallet.getAddress()
  const splt = window.sentre.splt

  const targetAddress = await splt.deriveAssociatedAddress(
    walletAddress,
    mintAddress,
  )
  let initialized = false
  try {
    const { state } = await splt.getAccountData(targetAddress)
    initialized = state > 0 ? true : false
  } catch (er) {
    initialized = false
  }
  if (!initialized)
    await splt.initializeAccount(mintAddress, walletAddress, wallet)
  return targetAddress
}

export const getWormholeDb = async <T>(key: WormholeStoreKey) => {
  const address = await window.sentre.wallet?.getAddress()
  if (!address) throw new Error('Login fist')
  const db = new PDB(address).createInstance('wormhole')
  const data = db.getItem<T>(key)
  return data
}
export const setWormholeDb = async (key: WormholeStoreKey, data: any) => {
  const address = await window.sentre.wallet?.getAddress()
  if (!address) throw new Error('Login fist')
  const db = new PDB(address).createInstance('wormhole')
  return db.setItem(key, data)
}

export const clearWormholeDb = async () => {
  const address = await window.sentre.wallet?.getAddress()
  if (!address) throw new Error('Login fist')
  const db = new PDB(address).dropInstance('wormhole')
  return db
}

export const logError = (error: unknown) => {
  window.notify({ type: 'error', description: (error as any).message })
}
