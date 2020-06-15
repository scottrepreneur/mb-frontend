import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { useWeb3React } from '../hooks'
import { safeAccess, getInsigniaContract, getFactoryContract } from '../utils'
import { fetchBadgeList } from '../badges'

const BLOCK_NUMBER = 'BLOCK_NUMBER'
const USD_PRICE = 'USD_PRICE'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'
const BADGE_LIST = 'BADGE_LIST'
const ROOT_HASHES = 'ROOT_HASHES'

const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'
const TOGGLE_WALLET_MODAL = 'TOGGLE_WALLET_MODAL'
const UPDATE_BADGE_LIST = 'UPDATE_BADGE_LIST'
const UPDATE_ROOT_HASHES = 'UPDATE_ROOT_HASHES'

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
    case UPDATE_ROOT_HASHES: {
      const { rootHashes } = payload
      return {
        ...state,
        [ROOT_HASHES]: rootHashes
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
    [ROOT_HASHES]: [],
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

  const updateRootHashes = useCallback((rootHashes) => {
    dispatch({ type: UPDATE_ROOT_HASHES, payload: { rootHashes } })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(() => [state, { updateBlockNumber, toggleWalletModal, updateBadgeList, updateRootHashes }], [
        state,
        updateBlockNumber,
        toggleWalletModal,
        updateBadgeList,
        updateRootHashes,
      ])}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function Updater() {
  const { library, chainId, account } = useWeb3React()

  const [, { updateBlockNumber, updateBadgeList, updateRootHashes }] = useApplicationContext()

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
      // console.log(data)
      if (data && chainId) {
        async function getRedeemedBadges() {
          const factory = getFactoryContract(chainId, library, account)
          const supply = await factory.totalSupply();
          let redeemedBadges = [];

          for (let i=0; i < supply; i++ ) {
            const owner = await factory.ownerOf(i);
            if (owner === account) {
              redeemedBadges.push(i)
            }
          }

          let redeemedTemplates = [];
          for (let j=0; j < redeemedBadges.length; j++) {
            const template = await factory.getBadgeTemplate(j);
            redeemedTemplates.push(template.toNumber())
          }
          for (let k=0; k < redeemedTemplates.length; k++) {
            data[k]['redeemed'] = 1
            // REMOVE AFTER TESTING 
            data[k]['unlocked'] = 1
          }
          
          updateBadgeList(data);
        }
        getRedeemedBadges();
      }
    })
    

  }, [chainId, library, account, updateBadgeList])

  useEffect(() => {
    async function getHashes() {
      if (chainId) {
        const insignia = getInsigniaContract(chainId, library, account)
        const factory = getFactoryContract(chainId, library, account)
        const templatesCount = await factory.getTemplatesCount();
        // console.log(templatesCount.toString('utf-8'));
        let hashes = [];
        for (let i = 0; i < templatesCount; i++) {
          // console.log(i)
          let thing;
          try {
             thing = await insignia.roots(i);
          }
          catch(error) {
            // console.log(error);
            thing = '0x0000000000000000000000000000000000000000000000000000000000000000'
          }
          // console.log(thing)
          hashes.push(thing)
        }
        // console.log(hashes);

        if (hashes) {
          updateRootHashes(hashes);
        }
      }
    }
    getHashes();
    
  }, [account, library, chainId, updateRootHashes])


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

export function useRootHashes() {
  const [state] = useApplicationContext()

  return state?.[ROOT_HASHES]
}
