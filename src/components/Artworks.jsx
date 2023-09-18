import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { purchaseNFT } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'
import Countdown from './Countdown'

const Artworks = ({ auctions, title, showOffer }) => {
  return (
    <div className="w-4//5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">
        {title ? title : 'Curren Bids'}
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {auctions.map((auction, i) => (
          <Auction key={i} auction={auction} showOffer={showOffer} />
        ))}
      </div>
    </div>
  )
}

const Auction = ({ auction, showOffer }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const onChangePrice = () => {
    setGlobalState('auction', auction)
    setGlobalState('priceModal', 'scale-100')
  }

  const onOfferItem = () => {
    setGlobalState('auction', auction)
    setGlobalState('offerModal', 'scale-100')
  }

  const onPlaceBid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidModal', 'scale-100')
  }

  const handleNftPurchase = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await purchaseNFT(auction)
          .then(() => resolve())
          .catch((error) => reject(error))
      }),
      {
        pending: 'Transfering NFT...',
        success: 'Transfer completed...',
        error: 'Encoutered an error',
      }
    )
  }

  return (
    <div
      className=" overflow-hidden bg-gray-800 rounded-md shadow-xl
    shadow-black md:mt-0 font-sans my-4"
    >
      <Link to={'/nft/' + auction.tokenId}>
        <img
          src={auction.image}
          alt={auction.name}
          className="object-cover w-full h-60"
        />
      </Link>

      <div
        className="shadow-lg shadow-gray-400 border-4 border-[#ffffff36]
      flex justify-between items-center text-gray-300 px-2"
      >
        <div className="flex flex-col items-start py-2 px-1">
          <span>Current Bid</span>
          <div className="font-bold text-center">{auction.price} ETH</div>
        </div>

        <div className="flex flex-col items-start py-2 px-1">
          <span>Auction End</span>
          <div className="font-bold text-center">
            {auction.live && auction.duration > Date.now() ? (
              <Countdown timestamp={auction.duration} />
            ) : (
              '00:00:00'
            )}
          </div>
        </div>
      </div>

      {showOffer ? (
        auction.live && Date.now() < auction.duration ? (
          <button
            className="bg-yellow-500 w-full h-[40px] p-2 text-center
            font-bold font-mono"
          >
            Auction Live
          </button>
        ) : (
          <div className="flex justify-start">
            <button
              className="bg-red-500 w-full h-[40px] p-2 text-center
            font-bold font-mono"
              onClick={onOfferItem}
            >
              Offer
            </button>
            <button
              className="bg-orange-500 w-full h-[40px] p-2 text-center
            font-bold font-mono"
              onClick={onChangePrice}
            >
              Change
            </button>
          </div>
        )
      ) : auction.biddable ? (
        <button
          className="bg-green-500 w-full h-[40px] p-2
          text-center font-bold font-mono"
          onClick={onPlaceBid}
        >
          Place a Bid
        </button>
      ) : (
        <button
          className="bg-red-500 w-full h-[40px] p-2
          text-center font-bold font-mono"
          onClick={handleNftPurchase}
          disabled={connectedAccount == auction.owner}
        >
          Buy NFT
        </button>
      )}
    </div>
  )
}

export default Artworks
