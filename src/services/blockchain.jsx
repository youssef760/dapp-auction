import abi from '../abis/src/contracts/Auction.sol/Auction.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
import { getGlobalState, setGlobalState } from '../store'

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi = abi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')

    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => window.location.reload())

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWalletConnected()
      await loadCollection()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet')
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const createNFTItem = async ({
  name,
  description,
  image,
  metadataURI,
  price,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.createAuction(
      name,
      description,
      image,
      metadataURI,
      toWei(price),
      {
        from: connectedAccount,
        value: toWei(0.02),
      }
    )

    await tx.wait()
  } catch (error) {
    reportError(error)
  }
}

const updatePrice = async (tokenId, price) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.chanagePrice(tokenId, toWei(price), {
      from: connectedAccount,
    })

    await tx.wait()
    await loadCollection()
  } catch (error) {
    reportError(error)
  }
}

const purchaseNFT = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.buyAuctionedItem(tokenId, {
      from: connectedAccount,
      value: toWei(price),
    })

    await tx.wait()
    await loadLiveAuctions()
  } catch (error) {
    reportError(error)
  }
}

const placeBid = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.placeBid(tokenId, {
      from: connectedAccount,
      value: toWei(price),
    })

    await tx.wait()
    await loadAuction(tokenId)
    await loadLiveAuctions()
  } catch (error) {
    reportError(error)
  }
}

const claimPrize = async (tokenId, bidderId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.claimPrize(tokenId, bidderId, {
      from: connectedAccount,
    })

    await tx.wait()
    await loadAuction(tokenId)
    await loadBidders(tokenId)
  } catch (error) {
    reportError(error)
  }
}

const offerItemOnMarket = async ({
  tokenId,
  biddable,
  sec,
  min,
  hour,
  day,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()

    tx = await contract.offerAuction(tokenId, biddable, sec, min, hour, day, {
      from: connectedAccount,
    })

    await tx.wait()
    await loadCollection()
    await loadLiveAuctions()
  } catch (error) {
    reportError(error)
  }
}

const loadCollection = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()
    const collection = await contract.getMyAuctions({ from: connectedAccount })
    setGlobalState('collections', structuredAuctions(collection))
  } catch (error) {
    reportError(error)
  }
}

const loadBidders = async (tokenId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const bidders = await contract.getBidders(tokenId)
    setGlobalState('bidders', structuredBidders(bidders))
  } catch (error) {
    reportError(error)
  }
}

const loadAuction = async (tokenId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const auction = await contract.getAuction(tokenId)

    setGlobalState('auction', structuredAuctions([auction])[0])
  } catch (error) {
    reportError(error)
  }
}

const loadLiveAuctions = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    let auctions = await contract.getLiveAuctions()
    auctions = structuredAuctions(auctions)
    auctions = auctions.filter((auction) => auction.duration > Date.now())
    setGlobalState('auctions', auctions)
  } catch (error) {
    reportError(error)
  }
}

const reportError = (error) => {
  console.log(error.message)
  throw new Error(error)
}

const structuredAuctions = (auctions) =>
  auctions
    .map((auction) => ({
      tokenId: auction.tokenId.toNumber(),
      owner: auction.owner.toLowerCase(),
      seller: auction.seller.toLowerCase(),
      winner: auction.winner.toLowerCase(),
      name: auction.name,
      description: auction.description,
      duration: Number(auction.duration + '000'),
      bids: auction.bids.toNumber(),
      image: auction.image,
      price: fromWei(auction.price),
      biddable: auction.biddable,
      sold: auction.sold,
      live: auction.live,
    }))
    .reverse()

const structuredBidders = (bidders) =>
  bidders
    .map((bidder, i) => ({
      bidderId: i,
      timestamp: Number(bidder.timestamp + '000'),
      bidder: bidder.bidder.toLowerCase(),
      price: fromWei(bidder.price),
      refunded: bidder.refunded,
      won: bidder.won,
    }))
    .sort((a, b) => b.price - a.price)

export {
  isWalletConnected,
  connectWallet,
  createNFTItem,
  loadCollection,
  updatePrice,
  offerItemOnMarket,
  loadLiveAuctions,
  purchaseNFT,
  placeBid,
  loadAuction,
  loadBidders,
  claimPrize,
}
