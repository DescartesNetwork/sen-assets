import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import { useWallet } from '@solana/wallet-adapter-react'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

export const getSolTokens = async (address: string) => {
  // const MY_WALLET_ADDRESS = 'FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T'
  const nodeUrl = window.sentre.splt.nodeUrl
  const connection = new Connection(nodeUrl, 'confirmed')

  const tokens = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    {
      filters: [
        {
          dataSize: 165, // number of bytes
        },
        {
          memcmp: {
            offset: 32, // number of bytes
            bytes: address, // base58 encoded string
          },
        },
      ],
    },
  )
  return tokens
}
