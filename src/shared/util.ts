import { getEtherNetwork } from 'lib/wormhole/helper/utils'

/**
 * Return a url to go to etherscan explorer
 * @param txHash - Address or TxId
 * @returns
 */
export const ethExplorer = (txHash: string): string => {
  if (getEtherNetwork() === 'goerli') {
    return `https://goerli.etherscan.io/tx/${txHash}`
  }
  return `https://etherscan.io/tx/${txHash}`
}
