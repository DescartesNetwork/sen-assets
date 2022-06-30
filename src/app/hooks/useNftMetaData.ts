import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'

import { MetadataType } from 'app/lib/metaplex'
import configs from 'app/configs'
import { DataLoader } from 'shared/dataloader'

const {
  sol: { metaplexNFT },
} = configs

const useNftMetaData = (mintAddress: string) => {
  const [metaData, setMetaData] = useState<MetadataType>()
  const [nftInfo, setNftInfo] = useState<any>()
  const [loading, setLoading] = useState(false)

  const getMetaData = useCallback(async () => {
    if (!account.isAddress(mintAddress)) {
      setMetaData(undefined)
      return setNftInfo(undefined)
    }
    setLoading(true)
    try {
      const metadata = await DataLoader.load(
        'getNftMetadata' + mintAddress,
        () => metaplexNFT.getNftMetadata(mintAddress),
      )
      setMetaData(metadata)

      const url = metadata.data.data.uri
      const response = await DataLoader.load(
        'getNftMetadataUrl' + mintAddress,
        // Error with axios
        () => fetch(url).then((val) => val.json()),
      )
      setNftInfo(response)
    } catch (error: any) {
      setMetaData(undefined)
      setNftInfo(undefined)
    } finally {
      setLoading(false)
    }
  }, [mintAddress])

  useEffect(() => {
    getMetaData()
  }, [getMetaData])

  return { metadata: metaData, nftInfo, loading }
}

export default useNftMetaData
