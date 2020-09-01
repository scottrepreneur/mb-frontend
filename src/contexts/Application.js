import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { useWeb3React } from '../hooks'
import {
  safeAccess,
  getBadgeAdminContract,
  getBadgeFactoryContract,
  getMcdChiefContract
  // getMcdPotContract,
  // getMcdFlipEthAContract
} from '../utils'
import { fetchBadgeList } from '../badges'
import { ON_CHAIN_TEMPLATES, BADGE_ADMIN_ROLE } from '../constants'

const BLOCK_NUMBER = 'BLOCK_NUMBER'
const USD_PRICE = 'USD_PRICE'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'
const BADGE_LIST = 'BADGE_LIST'
const ROOT_HASHES = 'ROOT_HASHES'
const BADGE_ADMIN_STATUS = 'BADGE_ADMIN_STATUS'

const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'
const TOGGLE_WALLET_MODAL = 'TOGGLE_WALLET_MODAL'
const UPDATE_BADGE_LIST = 'UPDATE_BADGE_LIST'
const UPDATE_ROOT_HASHES = 'UPDATE_ROOT_HASHES'
const UPDATE_BADGE_ADMIN_STATUS = 'UPDATE_BADGE_ADMIN_STATUS'

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
        [BADGE_LIST]: badgeList
      }
    }
    case UPDATE_ROOT_HASHES: {
      const { rootHashes } = payload
      return {
        ...state,
        [ROOT_HASHES]: rootHashes
      }
    }
    case UPDATE_BADGE_ADMIN_STATUS: {
      const { badgeAdminStatus } = payload
      return {
        ...state,
        [BADGE_ADMIN_STATUS]: badgeAdminStatus
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
    [BADGE_ADMIN_STATUS]: false
  })

  const updateBlockNumber = useCallback((networkId, blockNumber) => {
    dispatch({ type: UPDATE_BLOCK_NUMBER, payload: { networkId, blockNumber } })
  }, [])

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL })
  }, [])

  const updateBadgeList = useCallback(badgeList => {
    dispatch({ type: UPDATE_BADGE_LIST, payload: { badgeList } })
  }, [])

  const updateRootHashes = useCallback(rootHashes => {
    dispatch({ type: UPDATE_ROOT_HASHES, payload: { rootHashes } })
  }, [])

  const updateBadgeAdminStatus = useCallback(badgeAdminStatus => {
    dispatch({ type: UPDATE_BADGE_ADMIN_STATUS, payload: { badgeAdminStatus } })
  }, [])

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateBlockNumber,
            toggleWalletModal,
            updateBadgeList,
            updateRootHashes,
            updateBadgeAdminStatus
          }
        ],
        [state, updateBlockNumber, toggleWalletModal, updateBadgeList, updateRootHashes, updateBadgeAdminStatus]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function Updater() {
  const { library, chainId, account } = useWeb3React()

  const [, { updateBlockNumber, updateBadgeList, updateRootHashes, updateBadgeAdminStatus }] = useApplicationContext()

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
    fetchBadgeList(account)
      .then(data => {
        // console.log(data)
        if (data && chainId) {
          async function getRedeemedBadges() {
            const badgeFactory = getBadgeFactoryContract(chainId, library, account)
            const badgeAdmin = getBadgeAdminContract(chainId, library, account)
            const supply = await badgeFactory.totalSupply()
            console.log(parseInt(supply))
            let redeemedBadges = []

            // get redeemed badges
            for (let i = 0; i < supply; i++) {
              const owner = await badgeFactory.ownerOf(i)
              if (owner === account) {
                redeemedBadges.push(i)
              }
            }

            // get redeemed template and updated badge list
            let redeemedTemplates = []
            for (let j = 0; j < redeemedBadges.length; j++) {
              const template = await badgeFactory.getBadgeTemplate(redeemedBadges[j])
              redeemedTemplates.push(template.toNumber())
            }
            for (let k = 0; k < redeemedTemplates.length; k++) {
              data[redeemedTemplates[k]]['redeemed'] = 1
            }

            // on chain chief challenge
            const mcdChiefChallengeTemplate = ON_CHAIN_TEMPLATES['mcdChief']
            if (account && data[mcdChiefChallengeTemplate]['unlocked'] !== 1) {
              let voting = '0x0000000000000000000000000000000000000000000000000000000000000000'
              const mcdChief = getMcdChiefContract(chainId, library, account)
              voting = await mcdChief.votes(account)
              data[mcdChiefChallengeTemplate]['unlocked'] =
                voting !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? 1 : 0
            }

            let verifiedTemplates = []
            // REPLACE 32 WITH SOME NUMBER OF TEMPLATES VARIABLE
            for (let k = 0; k < 32; k++) {
              const verified = await badgeAdmin.verify(k, account)
              if (verified) {
                verifiedTemplates.push(k)
              }
            }

            if (verifiedTemplates.length > 0) {
              for (let l = 0; l < verifiedTemplates.length; l++) {
                console.log(verifiedTemplates[l])
                data[verifiedTemplates[l]]['verified'] = 1
              }
            }

            // on chain pot challenge
            // const mcdPotChallengeTemplate = ON_CHAIN_TEMPLATES['mcdPot']
            // if (account && data[mcdPotChallengeTemplate]['unlocked'] !== 1) {
            //   const mcdPot = getMcdPotContract(chainId, library, account)
            //   const pieBalance = await mcdPot.pie(account).catch(err => {
            //     console.log(err)
            //   })
            //   data[mcdPotChallengeTemplate]['unlocked'] = pieBalance > 1 * 10 ** 18 ? 1 : 0
            // }

            // on chain flipper guy challenge
            // const mcdFlipGuyChallengeTemplate = ON_CHAIN_TEMPLATES['mcdFlip']
            // if (account && data[mcdFlipGuyChallengeTemplate]['unlocked'] !== 1) {
            //   const mcdFlipEthA = getMcdFlipEthAContract(chainId, library, account)
            //   const flipGuy = await mcdFlipEthA.bids(1001).catch(err => {
            //     console.log(err)
            //   })
            //   data[mcdFlipGuyChallengeTemplate]['unlocked'] = flipGuy === account ? 1 : 0
            // }

            updateBadgeList(data)
          }
          getRedeemedBadges()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [chainId, library, account, updateBadgeList])

  useEffect(() => {
    async function getHashes() {
      if (chainId && account) {
        const badgeAdmin = getBadgeAdminContract(chainId, library, account)
        const badgeFactory = getBadgeFactoryContract(chainId, library, account)
        const templatesCount = await badgeFactory.getTemplatesCount()

        let hashes = []
        for (let i = 0; i < templatesCount; i++) {
          let thing
          try {
            thing = await badgeAdmin.roots(i)
          } catch (error) {
            thing = '0x0000000000000000000000000000000000000000000000000000000000000000'
          }
          hashes.push(thing)
        }

        if (hashes) {
          updateRootHashes(hashes)
        }
      }
    }
    getHashes()
  }, [account, library, chainId, updateRootHashes])

  useEffect(() => {
    async function getBadgeAdminStatus() {
      let isBadgeAdmin = false
      if (account) {
        const badgeAdmin = getBadgeAdminContract(chainId, library, account)
        // const badgeAdminRole = await badgeAdmin.ADMIN_ROLE
        // console.log(badgeAdminRole)
        isBadgeAdmin = await badgeAdmin.hasRole(BADGE_ADMIN_ROLE, account).catch(err => {
          console.log(err)
        })
      }

      updateBadgeAdminStatus(isBadgeAdmin === true)
    }
    getBadgeAdminStatus()
  }, [account, library, chainId, updateBadgeAdminStatus])

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

export function useBadgeAdminStatus() {
  const [state] = useApplicationContext()

  return state?.[BADGE_ADMIN_STATUS]
}
