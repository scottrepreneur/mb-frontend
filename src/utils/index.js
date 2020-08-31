import { ethers } from 'ethers'

import { ADDRESSES, CONTRACT_ABIS, SUPPORTED_THEMES } from '../constants'
import { formatFixed } from '@uniswap/sdk'

import UncheckedJsonRpcSigner from './signer'

export const ERROR_CODES = ['TOKEN_NAME', 'TOKEN_SYMBOL', 'TOKEN_DECIMALS'].reduce(
  (accumulator, currentValue, currentIndex) => {
    accumulator[currentValue] = currentIndex
    return accumulator
  },
  {}
)

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
        object
      )
    : null
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.'
}

export function getEtherscanLink(networkId, data, type) {
  const prefix = `https://${ETHERSCAN_PREFIXES[networkId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function getQueryParam(windowLocation, name) {
  var q = windowLocation.search.match(new RegExp('[?&]' + name + '=([^&#?]*)'))
  return q && q[1]
}

export function getAllQueryParams() {
  let params = {}
  params.theme = checkSupportedTheme(getQueryParam(window.location, 'theme'))

  params.inputCurrency = isAddress(getQueryParam(window.location, 'inputCurrency'))
    ? isAddress(getQueryParam(window.location, 'inputCurrency'))
    : ''
  params.outputCurrency = isAddress(getQueryParam(window.location, 'outputCurrency'))
    ? isAddress(getQueryParam(window.location, 'outputCurrency'))
    : getQueryParam(window.location, 'outputCurrency') === 'ETH'
    ? 'ETH'
    : ''
  params.slippage = !isNaN(getQueryParam(window.location, 'slippage')) ? getQueryParam(window.location, 'slippage') : ''
  params.exactField = getQueryParam(window.location, 'exactField')
  params.exactAmount = !isNaN(getQueryParam(window.location, 'exactAmount'))
    ? getQueryParam(window.location, 'exactAmount')
    : ''
  params.theme = checkSupportedTheme(getQueryParam(window.location, 'theme'))
  params.recipient = isAddress(getQueryParam(window.location, 'recipient'))
    ? getQueryParam(window.location, 'recipient')
    : ''

  // Add Liquidity params
  params.ethAmount = !isNaN(getQueryParam(window.location, 'ethAmount'))
    ? getQueryParam(window.location, 'ethAmount')
    : ''
  params.tokenAmount = !isNaN(getQueryParam(window.location, 'tokenAmount'))
    ? getQueryParam(window.location, 'tokenAmount')
    : ''
  params.token = isAddress(getQueryParam(window.location, 'token'))
    ? isAddress(getQueryParam(window.location, 'token'))
    : ''

  // Remove liquidity params
  params.poolTokenAmount = !isNaN(getQueryParam(window.location, 'poolTokenAmount'))
    ? getQueryParam(window.location, 'poolTokenAmount')
    : ''
  params.poolTokenAddress = isAddress(getQueryParam(window.location, 'poolTokenAddress'))
    ? isAddress(getQueryParam(window.location, 'poolTokenAddress'))
      ? isAddress(getQueryParam(window.location, 'poolTokenAddress'))
      : ''
    : ''

  // Create Exchange params
  params.tokenAddress = isAddress(getQueryParam(window.location, 'tokenAddress'))
    ? isAddress(getQueryParam(window.location, 'tokenAddress'))
    : ''

  return params
}

export function checkSupportedTheme(themeName) {
  if (themeName && themeName.toUpperCase() in SUPPORTED_THEMES) {
    return themeName.toUpperCase()
  }
  return null
}

export function getNetworkName(networkId) {
  switch (networkId) {
    case 1: {
      return 'the Main Ethereum Network'
    }
    case 3: {
      return 'the Ropsten Test Network'
    }
    case 4: {
      return 'the Rinkeby Test Network'
    }
    case 5: {
      return 'the Görli Test Network'
    }
    case 42: {
      return 'the Kovan Test Network'
    }
    default: {
      return 'the correct network'
    }
  }
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000))
  return value.add(offset)
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

// account is optional
export function getContract(address, ABI, library, account) {
  // console.log(!isAddress((address)));
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
}

// account is optional
export function getBadgeFactoryContract(networkId, library, account) {
  return getContract(ADDRESSES['badgeFactory'][networkId], CONTRACT_ABIS['badgeFactory'], library, account)
}

// account is optional
export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, CONTRACT_ABIS['exchange'], library, account)
}

// account is optional
export function getBadgeAdminContract(networkId, library, account) {
  return getContract(ADDRESSES['badgeAdmin'][networkId], CONTRACT_ABIS['badgeAdmin'], library, account)
}

export function getMcdChiefContract(networkId, library, account) {
  return getContract(ADDRESSES['mcdChief'][networkId], CONTRACT_ABIS['mcdChief'], library, account)
}

export function getMcdPotContract(networkId, library, account) {
  return getContract(ADDRESSES['mcdChief'][networkId], CONTRACT_ABIS['mcdPot'], library, account)
}

export function getMcdFlipEthAContract(networkId, library, account) {
  return getContract(ADDRESSES['mcdChief'][networkId], CONTRACT_ABIS['mcdFlipEthA'], library, account)
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`)
  }
  return library.getBalance(address)
}

export function formatEthBalance(balance) {
  return amountFormatter(balance, 18, 6)
}

export function formatTokenBalance(balance, decimal) {
  return !!(balance && Number.isInteger(decimal)) ? amountFormatter(balance, decimal, Math.min(4, decimal)) : 0
}

export function formatToUsd(price) {
  const format = { decimalSeparator: '.', groupSeparator: ',', groupSize: 3 }
  const usdPrice = formatFixed(price, {
    decimalPlaces: 2,
    dropTrailingZeros: false,
    format
  })
  return usdPrice
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(`Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`)
  }

  return getContract(tokenAddress, CONTRACT_ABIS['erc20'], library).balanceOf(address)
}

// get the token allowance
export async function getTokenAllowance(address, tokenAddress, spenderAddress, library) {
  if (!isAddress(address) || !isAddress(tokenAddress) || !isAddress(spenderAddress)) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    )
  }

  return getContract(tokenAddress, CONTRACT_ABIS['erc20'], library).allowance(address, spenderAddress)
}

// amount must be a BigNumber, {base,display}Decimals must be Numbers
export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(displayDecimals))
    )

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, '0'))
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}
