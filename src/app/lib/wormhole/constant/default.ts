import { TransferData } from "./wormhole";

export const DEFAULT_TRANSFER_DATA: TransferData = {
  step: 0,
  amount: '0',
  from: '',
  to: '',
  sourceNetWork: {
    emitterAddress: '',
    sequence: '',
  },
  wormholeNetWork: {
    vaaHex: '',
  },
  redeemSolana: {
    txId: '',
  },
}
