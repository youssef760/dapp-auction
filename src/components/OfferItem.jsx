import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import picture6 from '../assets/images/picture6.png'
import { offerItemOnMarket } from '../services/blockchain'
import { setGlobalState, useGlobalState } from '../store'

const OfferItem = () => {
  const [offerModal] = useGlobalState('offerModal')
  const [auction] = useGlobalState('auction')

  const [period, setPeriod] = useState('')
  const [biddable, setBiddable] = useState('')
  const [timeline, setTimeline] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!period || !biddable || !timeline) return

    const params = {
      biddable: biddable == 'true',
      tokenId: auction.tokenId,
    }

    if (timeline == 'sec') {
      params.sec = Number(period)
      params.min = 0
      params.hour = 0
      params.day = 0
    } else if (timeline == 'min') {
      params.sec = 0
      params.min = Number(period)
      params.hour = 0
      params.day = 0
    } else if (timeline == 'hour') {
      params.sec = 0
      params.min = 0
      params.hour = Number(period)
      params.day = 0
    } else {
      params.sec = 0
      params.min = 0
      params.hour = 0
      params.day = Number(period)
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await offerItemOnMarket(params)
          .then(() => {
            onClose()
            resetForm()
            resolve()
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Offering Auction...',
        success: 'Auction offered...',
        error: 'Encoutered an error',
      }
    )
  }

  const onClose = () => {
    resetForm()
    setGlobalState('offerModal', 'scale-0')
  }

  const resetForm = () => {
    setPeriod('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${offerModal}`}
    >
      <div
        className="bg-[#151c25] shadow-xl shadow-[#25bd9c] rounded-xl
        w-11/12 sm:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center text-gray-400">
            <p className="font-semibold italic">Offer {auction.name}</p>
            <button
              type="button"
              onClick={onClose}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-center items-center mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                src={auction.image || picture6}
                alt="Artwork"
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              type="number"
              min={1}
              className="block w-full text-sm text-slate-500 focus:outline-none
              cursor-pointer focus:ring-0 bg-transparent border-0 px-4 py-2"
              placeholder="Days E.g 7"
              name="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
            <select
              name="period"
              className="block w-full text-sm text-slate-500 focus:outline-none
              cursor-pointer focus:ring-0 bg-transparent border-0 px-4 py-2"
              placeholder="Days E.g 7"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
            >
              <option value="" hidden>
                {' '}
                Select Duration
              </option>
              <option value="sec">Seconds</option>
              <option value="min">Minutes</option>
              <option value="hour">Hours</option>
              <option value="day">Days</option>
            </select>
          </div>

          <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
            <select
              name="period"
              className="block w-full text-sm text-slate-500 focus:outline-none
              cursor-pointer focus:ring-0 bg-transparent border-0 px-4 py-2"
              placeholder="Days E.g 7"
              value={biddable}
              onChange={(e) => setBiddable(e.target.value)}
              required
            >
              <option value="" hidden>
                {' '}
                Select Biddability
              </option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex justify-center items-center
            w-full text-white text-md bg-[#25bd9c] mt-5
            py-2 px-5 rounded-full drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-white focus:ring-0
            hover:border hover:border-[#25bd9c] focus:outline-none"
          >
            Offer item
          </button>
        </form>
      </div>
    </div>
  )
}

export default OfferItem
