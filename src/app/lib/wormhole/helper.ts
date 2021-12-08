import axios from 'axios'
import { Connection, Transaction } from '@solana/web3.js'
import { getSignedVAA } from '@certusone/wormhole-sdk'

import { account, WalletInterface, utils } from '@senswap/sen-js'
import { TokenEtherInfo } from 'app/model/wormhole.controller'
import { asyncWait } from 'shared/util'
import storage from 'shared/storage'
import PDB from 'shared/pdb'
import { WormholeStoreKey } from './constant/wormhole'
import { MORALIS_INFO, ETH_TOKEN_BRIDGE_ADDRESS } from './constant/ethConfig'
import ABI from './abi.json'

const Web3Utils = require('web3-utils');
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
) => {
  if (networkName === 'mainnet') networkName = 'eth'
  const abi = await axios({
    method: 'get',
    url: `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc&apikey=H7IQG6XU3FAV5MVCVJC7WD2RVSXX5DPJP8`,
  })

  abi.data.result = JSON.parse(abi.data.result)
  // const a = [{"inputs": [{"type": "address", "name": ""}], "constant": true, "name": "isInstantiation", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [{"type": "address[]", "name": "_owners"}, {"type": "uint256", "name": "_required"}, {"type": "uint256", "name": "_dailyLimit"}], "constant": false, "name": "create", "payable": false, "outputs": [{"type": "address", "name": "wallet"}], "type": "function"}, {"inputs": [{"type": "address", "name": ""}, {"type": "uint256", "name": ""}], "constant": true, "name": "instantiations", "payable": false, "outputs": [{"type": "address", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "creator"}], "constant": true, "name": "getInstantiationCount", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"indexed": false, "type": "address", "name": "sender"}, {"indexed": false, "type": "address", "name": "instantiation"}], "type": "event", "name": "ContractInstantiation", "anonymous": false}]
  // console.log(a)
  // console.log(abi.data.result)
  // console.log(Web3Utils.toAscii(Web3Utils.toHex('0x0f5287b0000000000000000000000000ba62bcfcaafc6622853cca2be6ac7d845bc0f2dc0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000013b5351d918a7d706c772d646e16d0db1bb0d3a636a0e6eb687e2bc2a17cfc56b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c3650000')))
  
  abiDecoder.addABI(ABI)
  const dd ="0x0f5287b0000000000000000000000000ba62bcfcaafc6622853cca2be6ac7d845bc0f2dc0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000013b5351d918a7d706c772d646e16d0db1bb0d3a636a0e6eb687e2bc2a17cfc56b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003a0f0000"
  const decodedData = abiDecoder.decodeMethod(dd)

  console.log(decodedData)
  const tokens = []
  const { data } = await axios({
    method: 'get',
    url: `${MORALIS_INFO.url}/${address}?chain=${networkName}`,
    headers: {
      'X-API-Key': MORALIS_INFO.apiKey
    },
  })
  for (const token of data.result) {
    if(token.to_address === ETH_TOKEN_BRIDGE_ADDRESS.goerli) {
      tokens.push(token)
    }
  }
  console.log(tokens)
  return tokens
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
