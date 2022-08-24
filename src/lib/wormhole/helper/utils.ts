import { Connection, Transaction } from '@solana/web3.js'
import {
  getSignedVAA,
  getEmitterAddressEth,
  getIsTransferCompletedSolana,
} from '@certusone/wormhole-sdk'

import { account, WalletInterface } from '@senswap/sen-js'
import {
  StepTransfer,
  WormholeContext,
  WormholeStoreKey,
} from 'constant/types/wormhole'
import WohEthSol from '../wohEthSol'
import { net, PDB } from '@sentre/senhub'

export const getEtherNetwork = () => {
  const solNetwork = net
  const etherNetwork = solNetwork === 'mainnet' ? 'mainnet' : 'goerli'
  return etherNetwork
}

export const getNextStep = async (
  txHash: string,
  context: WormholeContext,
  sequence: string,
): Promise<StepTransfer> => {
  const listTransferState = await WohEthSol.fetchAll()

  for (let item of Object.values(listTransferState)) {
    if (txHash === item.transferData.txHash) {
      return item.transferData.nextStep
    }
  }

  const { vaaBytes } = await getSignedVAA(
    context.wormholeRpc,
    context.srcChainId,
    getEmitterAddressEth(context.srcTokenBridgeAddress),
    sequence,
  )

  const isRedeemed = await getIsTransferCompletedSolana(
    context.targetTokenBridgeAddress,
    vaaBytes,
    window.sentre.splt.connection,
  )
  return isRedeemed ? StepTransfer.Finish : StepTransfer.WaitSigned
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
  if (!address) throw new Error('Wallet is not connected')
  const db = new PDB(address).createInstance('wormhole')
  const data = db.getItem<T>(key)
  return data
}
export const setWormholeDb = async (key: WormholeStoreKey, data: any) => {
  const address = await window.sentre.wallet?.getAddress()
  if (!address) throw new Error('Wallet is not connected')
  const db = new PDB(address).createInstance('wormhole')
  return db.setItem(key, data)
}

export const clearWormholeDb = async () => {
  const address = await window.sentre.wallet?.getAddress()
  if (!address) throw new Error('Wallet is not connected')
  const db = new PDB(address).dropInstance('wormhole')
  return db
}
