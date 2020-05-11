import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { useWeb3React } from '../hooks'
import { safeAccess } from '../utils'
import { fetchBadgeList } from '../badges'

const BLOCK_NUMBER = 'BLOCK_NUMBER'
const USD_PRICE = 'USD_PRICE'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'
const BADGE_LIST = 'BADGE_LIST'

const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'
const TOGGLE_WALLET_MODAL = 'TOGGLE_WALLET_MODAL'
const UPDATE_BADGE_LIST = 'UPDATE_BADGE_LIST'

const ApplicationContext = createContext()

function useApplicationContext() {
  return useContext(ApplicationContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_BLOCK_NUMBER: {
      const { networkId, blockNumber } = payload
      return {
        ...state,
        [BLOCK_NUMBER]: {
          ...(safeAccess(state, [BLOCK_NUMBER]) || {}),
          [networkId]: blockNumber
        }
      }
    }

    case TOGGLE_WALLET_MODAL: {
      return { ...state, [WALLET_MODAL_OPEN]: !state[WALLET_MODAL_OPEN] }
    }
    case UPDATE_BADGE_LIST: {
      const { badgeList } = payload
      return {
        ...state,
        [BADGE_LIST]: badgeList,
      }
    }
    default: {
      throw Error(`Unexpected action type in ApplicationContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [BLOCK_NUMBER]: {},
    [USD_PRICE]: {},
    [WALLET_MODAL_OPEN]: false,
    [BADGE_LIST]: [],
  })

  const updateBlockNumber = useCallback((networkId, blockNumber) => {
    dispatch({ type: UPDATE_BLOCK_NUMBER, payload: { networkId, blockNumber } })
  }, [])

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const updateBadgeList = useCallback((badgeList) => {
    dispatch({ type: UPDATE_BADGE_LIST, payload: { badgeList } })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(() => [state, { updateBlockNumber, toggleWalletModal, updateBadgeList }], [
        state,
        updateBlockNumber,
        toggleWalletModal,
        updateBadgeList
      ])}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function Updater() {
  const { library, chainId, account } = useWeb3React()

  const [, { updateBlockNumber, updateBadgeList }] = useApplicationContext()

  // update block number
  useEffect(() => {
    if (library) {
      let stale = false

      function update() {
        library
          .getBlockNumber()
          .then(blockNumber => {
            if (!stale) {
              updateBlockNumber(chainId, blockNumber)
            }
          })
          .catch(() => {
            if (!stale) {
              updateBlockNumber(chainId, null)
            }
          })
      }

      update()
      library.on('block', update)

      return () => {
        stale = true
        library.removeListener('block', update)
      }
    }
  }, [chainId, library, updateBlockNumber])

  useEffect(() => {
    fetchBadgeList(account).then((data) => {
      if (data) {
        updateBadgeList(data)
      }
    })
  }, [account, updateBadgeList])


  return null
}

export function useBlockNumber() {
  const { chainId } = useWeb3React()

  const [state] = useApplicationContext()

  return safeAccess(state, [BLOCK_NUMBER, chainId])
}

export function useWalletModalOpen() {
  const [state] = useApplicationContext()

  return state[WALLET_MODAL_OPEN]
}

export function useWalletModalToggle() {
  const [, { toggleWalletModal }] = useApplicationContext()

  return toggleWalletModal
}

export function useBadgeList() {
  const [state] = useApplicationContext()

  return state?.[BADGE_LIST]
}
