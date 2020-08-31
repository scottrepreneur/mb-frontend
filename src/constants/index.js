import { injected, walletconnect, walletlink, fortmatic, portis } from '../connectors'

import EXCHANGE_ABI from '../constants/abis/exchange'
import ERC20_ABI from '../constants/abis/erc20'
import ERC20_BYTES32_ABI from '../constants/abis/erc20_bytes32'
import BADGE_FACTORY_ABI from '../constants/abis/badgeFactory'
import BADGE_ADMIN_ABI from '../constants/abis/badgeAdmin'
import MCD_CHIEF_ABI from '../constants/abis/mcdChief'
import MCD_POT_ABI from '../constants/abis/mcdPot'
import MCD_FLIP_ABI from '../constants/abis/mcdFlip'

export const ADDRESSES = {
  badgeAdmin: {
    // v5
    1: '',
    42: '0x9E8286abBfE37A7813e31468e4a586c5aB270cD0'
  },
  badgeFactory: {
    // v5
    1: '',
    42: '0x6C31CbF214422Ac810573BEe5F20c445200068dD'
  },
  mcdChief: {
    1: '0x9eF05f7F6deB616fd37aC3c959a2dDD25A54E4F5',
    42: '0xbBFFC76e94B34F72D96D054b31f6424249c1337d'
  },
  mcdPot: {
    1: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
    42: '0xEA190DBDC7adF265260ec4dA6e9675Fd4f5A78bb'
  },
  mcdFlipEthA: {
    1: '0xF32836B9E1f47a0515c6Ec431592D5EbC276407f',
    42: '0x750295A8db0580F32355f97de7918fF538c818F1'
  }
}

export const ON_CHAIN_TEMPLATES = {
  mcdPot: 0,
  mcdChief: 14,
  mcdFlipEthA: 29
}

export const CONTRACT_ABIS = {
  exchange: EXCHANGE_ABI,
  erc20: ERC20_ABI,
  erc20_bytes32: ERC20_BYTES32_ABI,
  badgeAdmin: BADGE_ADMIN_ABI,
  badgeFactory: BADGE_FACTORY_ABI,
  mcdChief: MCD_CHIEF_ABI,
  mcdPot: MCD_POT_ABI,
  mcdFlipEthA: MCD_FLIP_ABI
}

export const SUPPORTED_THEMES = {
  DARK: 'DARK',
  LIGHT: 'LIGHT'
}

const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== '42'
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS,
        ...{
          WALLET_CONNECT: {
            connector: walletconnect,
            name: 'WalletConnect',
            iconName: 'walletConnectIcon.svg',
            description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
            href: null,
            color: '#4196FC'
          },
          WALLET_LINK: {
            connector: walletlink,
            name: 'Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Use Coinbase Wallet app on mobile device',
            href: null,
            color: '#315CF5'
          },
          COINBASE_LINK: {
            name: 'Open in Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Open in Coinbase Wallet app.',
            href: 'https://go.cb-w.com/mtUDhEZPy1',
            color: '#315CF5',
            mobile: true,
            mobileOnly: true
          },
          TRUST_WALLET_LINK: {
            name: 'Open in Trust Wallet',
            iconName: 'trustWallet.png',
            description: 'iOS and Android app.',
            href: 'https://link.trustwallet.com/open_url?coin_id=60&url=https://uniswap.exchange/swap',
            color: '#1C74CC',
            mobile: true,
            mobileOnly: true
          },
          FORTMATIC: {
            connector: fortmatic,
            name: 'Fortmatic',
            iconName: 'fortmaticIcon.png',
            description: 'Login using Fortmatic hosted wallet',
            href: null,
            color: '#6748FF',
            mobile: true
          },
          Portis: {
            connector: portis,
            name: 'Portis',
            iconName: 'portisIcon.png',
            description: 'Login using Portis hosted wallet',
            href: null,
            color: '#4A6C9B',
            mobile: true
          }
          // Torus: {
          //   connector: torus,
          //   name: 'Torus',
          //   iconName: 'torus.png',
          //   description: 'Login via Google, Facebook and others',
          //   href: null,
          //   color: '#5495F7',
          //   mobile: true
          // }
        }
      }

// list of tokens that lock fund on adding liquidity - used to disable button
export const brokenTokens = [
  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  '0x95dAaaB98046846bF4B2853e23cba236fa394A31',
  '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
  '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA',
  '0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75',
  '0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037'
]

export const broken777Tokens = [
  '0x58e8a6c0e0b58bca809f1faee01f1662c9fc460e',
  '0xbdfa65533074b0b23ebc18c7190be79fa74b30c2',
  '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
  '0x9b869c2eaae08136c43d824ea75a2f376f1aa983',
  '0x09a8f2041be23e8ec3c72790c9a92089bc70fbca',
  '0x49d716dfe60b37379010a75329ae09428f17118d',
  '0x30e0c58c5670e0bdec98f29f66b092e43e98d699',
  '0x3212b29e33587a00fb1c83346f5dbfa69a458923',
  '0x5cffc0b73df80144f0f3f5bf75672777af2bbbfe',
  '0x0d31444c3f3cd583f30ca1b7cedc973db4bf5abf'
]

export const NetworkContextName = 'NETWORK'
