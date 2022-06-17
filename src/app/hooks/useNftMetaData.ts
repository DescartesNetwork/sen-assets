import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import axios from 'axios'

import { MetadataType } from 'app/lib/metaplex'
import configs from 'app/configs'

const {
  sol: { metaplexNFT },
} = configs

const useNftMetaData = (mintAddress: string) => {
  const [metaData, setMetaData] = useState<MetadataType>()
  const [nftInfo, setNftInfo] = useState<any>()

  const getMetaData = useCallback(async () => {
    if (!account.isAddress(mintAddress)) {
      setMetaData(undefined)
      return setNftInfo(undefined)
    }
    try {
      const metadata = await metaplexNFT.getNftMetadata(mintAddress)
      setMetaData(metadata)
      const url = metadata.data.data.uri
      const response = await axios.get(url)
      setNftInfo(response.data)
    } catch (error: any) {
      setMetaData(undefined)
      setNftInfo(undefined)
    }
  }, [mintAddress])

  useEffect(() => {
    getMetaData()
  }, [getMetaData])

  return { metadata: metaData, nftInfo }
}

export default useNftMetaData
