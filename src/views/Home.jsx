import { useEffect } from 'react'
import Artworks from '../components/Artworks'
import CreateNFT from '../components/CreateNFT'
import Empty from '../components/Empty'
import Hero from '../components/Hero'
import { loadLiveAuctions } from '../services/blockchain'
import { useGlobalState } from '../store'

const Home = () => {
  const [auctions] = useGlobalState('auctions')
  useEffect(async () => {
    await loadLiveAuctions()
  }, [])

  return (
    <div className="w-4/5 mx-auto mt-11">
      <Hero />
      {auctions.length > 0 ? <Artworks auctions={auctions} /> : <Empty />}
      <CreateNFT />
    </div>
  )
}

export default Home
