import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '@senhub/providers'

import { MetadataDataType } from 'app/lib/metaplex'
import configs from 'app/configs'
import { BN } from 'bn.js'

const {
  sol: { metaplexNFT },
} = configs

const useOwnerNFT = (ownerPublickey: string) => {
  const [nfts, setNfts] = useState<MetadataDataType[]>([])
  const [nftsFiltered, setNftFiltered] = useState<MetadataDataType[]>()
  const { accounts } = useAccount()

  const fetchNFTs = useCallback(async () => {
    if (!ownerPublickey) return setNfts([])
    const nftsFetching = await metaplexNFT.findDataByOwner(ownerPublickey)
    setNfts(nftsFetching)
  }, [ownerPublickey])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const filterNFTs = useCallback(async () => {
    const { splt } = window.sentre
    let nftsFiltered: MetadataDataType[] = []
    await Promise.all(
      nfts.map(async (nft: MetadataDataType) => {
        const nftTokenAccount = await splt.deriveAssociatedAddress(
          ownerPublickey,
          nft.mint,
        )
        let nftAccountData = accounts[nftTokenAccount]
        if (new BN(nftAccountData?.amount.toString()).eq(new BN(1))) {
          nftsFiltered.push(nft)
        }
      }),
    )
    return setNftFiltered(nftsFiltered)
  }, [accounts, nfts, ownerPublickey])

  useEffect(() => {
    filterNFTs()
  }, [filterNFTs])

  return { nfts: nftsFiltered }
}

export default useOwnerNFT
