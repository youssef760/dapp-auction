import { createGlobalState } from 'react-hooks-global-state'

const { getGlobalState, useGlobalState, setGlobalState } = createGlobalState({
  connectedAccount: '',
  boxModal: 'scale-0',
  offerModal: 'scale-0',
  priceModal: 'scale-0',
  bidModal: 'scale-0',
  auctions: [],
  auction: null,
  collections: [],
  bidders: [],
})

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

export { getGlobalState, useGlobalState, setGlobalState, truncate }
