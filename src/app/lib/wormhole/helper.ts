import axios from 'axios'

import { Connection, Transaction } from '@solana/web3.js'
import { getSignedVAA } from '@certusone/wormhole-sdk'
import { account, WalletInterface, utils } from '@senswap/sen-js'

import { TokenEtherInfo } from 'app/model/wormhole.controller'
import { asyncWait } from 'shared/util'
import storage from 'shared/storage'
import PDB from 'shared/pdb'
import { WormholeStoreKey } from './constant/wormhole'
import { MORALIS_INFO } from './constant/ethConfig'

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
  const tokens = []
  const  data = await axios({
    method: 'get',
    url: `${MORALIS_INFO.url}/${address}?chain=${networkName}`,
    headers: {
      'X-API-Key': MORALIS_INFO.apiKey,
    },
  })
  console.log(data, 'nguyen Duy Yta')
  // for (const token of data) {
  //   token.decimals = Number(token.decimals)
  //   token.balance = BigInt(token.balance)
  //   token.amount = utils.undecimalize(token.balance, token.decimals)
  //   token.address = token.token_address
  //   tokens.push(token)
  // }
  // return tokens
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
