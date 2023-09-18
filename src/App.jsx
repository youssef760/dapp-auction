import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ChangePrice from './components/ChangePrice'
import Footer from './components/Footer'
import Header from './components/Header'
import OfferItem from './components/OfferItem'
import PlaceBid from './components/PlaceBid'
import { isWalletConnected } from './services/blockchain'
import { useGlobalState } from './store'
import Collections from './views/Collections'
import Home from './views/Home'
import NFT from './views/NFT'

const App = () => {
  const [auction] = useGlobalState('auction')
  useEffect(async () => {
    await isWalletConnected()
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-t from-gray-800 bg-repeat
    via-[#25bd9c] to-gray-900 bg-center subpixel-antialiased"
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/nft/:id" element={<NFT />} />
      </Routes>
      <Footer />

      {auction ? (
        <>
          <ChangePrice />
          <PlaceBid />
          <OfferItem />
        </>
      ) : null}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  )
}

export default App
