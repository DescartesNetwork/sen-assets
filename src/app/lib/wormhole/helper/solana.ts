import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export const getSolConnection = () => {
  const nodeUrl = window.sentre.splt.nodeUrl
  return new Connection(nodeUrl, 'confirmed')
}

export const getSolTokens = async (address: string) => {
  // const MY_WALLET_ADDRESS = 'FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T'
  const nodeUrl = window.sentre.splt.nodeUrl
  const connection = new Connection(nodeUrl, 'confirmed')
  console.log(TOKEN_PROGRAM_ID.toBase58(), 'lslslsls')

  const tokens = await connection.getTokenAccountsByOwner(
    new PublicKey(address),
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )
  for (let index = 0; index < tokens.value.length; index++) {
    const element = tokens.value[index]
    const addrsess = element.pubkey.toBase58()
    // const balance = await connection.getBalance(addrsess)
    // console.log(balance)
  }
  // tokens.value.map(async (tok) => {
  //   console.log(balance)
  // })
  console.log(tokens, address, 'ksksskks')
  return tokens.value
}
