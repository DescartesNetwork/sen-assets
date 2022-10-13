import { useCallback, useEffect, useState } from 'react'
import { useAccounts, splt } from '@sentre/senhub'

import { MetadataDataType } from 'lib/metaplex'
import configs from 'configs'
import { BN } from 'bn.js'
import { DataLoader } from '@sentre/senhub'

const {
  sol: { metaplexNFT },
} = configs

const useOwnerNFT = (ownerPublickey: string) => {
  const [nfts, setNfts] = useState<MetadataDataType[]>()
  const [nftsFiltered, setNftFiltered] = useState<MetadataDataType[]>()
  const accounts = useAccounts()

  const fetchNFTs = useCallback(async () => {
    if (!ownerPublickey) return setNfts(undefined)
    const nftsFetching = await DataLoader.load(
      'findDataByOwner' + ownerPublickey,
      () => metaplexNFT.findDataByOwner(ownerPublickey),
    )
    setNfts(nftsFetching)
  }, [ownerPublickey])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const filterNFTs = useCallback(async () => {
    if (!nfts) return setNftFiltered(undefined)
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
