import React from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { lighten, darken, transparentize } from 'polished'
import Toggle from 'react-switch'
import useMedia from 'use-media'

import { Link } from '../../theme'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import Web3Status from '../Web3Status'

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.makerOrange};

  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.footerLink};
  }

  #title {
    display: inline;
    font-size: 0.825rem;
    margin-right: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.makerOrange};
    :hover {
      color: ${({ theme }) => lighten(0.2, theme.makerOrange)};
    }
  }
`

const StyledToggle = styled(Toggle)`
  margin-right: 24px;

  .react-switch-bg[style] {
    background-color: ${({ theme }) => darken(0.05, theme.inputBackground)} !important;
    border: 1px solid ${({ theme }) => theme.concreteGray} !important;
  }

  .react-switch-handle[style] {
    background-color: ${({ theme }) => theme.inputBackground};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.93, theme.shadowColor)};
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    border-color: ${({ theme }) => theme.mercuryGray} !important;
    top: 2px !important;
  }
`

const EmojiToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: Arial sans-serif;
`

export default function Footer() {
  const [isDark, toggleDarkMode] = useDarkModeManager()

  const isExtraSmall = useMedia({ maxWidth: "970px" })

  return (
    <FooterFrame>
      <FooterElement>
        {!isExtraSmall ?
          <Title>
            <Link id="link" href="https://github.com/naszam/maker-badges">
              <h1 id="title">Contracts</h1>
            </Link>
            <Link id="link" href="https://github.com/scottrepreneur/mb-frontend">
              <h1 id="title">Frontend</h1>
            </Link>
            <Link id="link" href="https://github.com/scottrepreneur/mb-merkle-service">
              <h1 id="title">Merkle Service</h1>
            </Link>
          </Title> 
          :
          <Web3Status /> 
        }
      </FooterElement>

      <StyledToggle
        checked={!isDark}
        uncheckedIcon={
          <EmojiToggle role="img" aria-label="moon">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            🌙️
          </EmojiToggle>
        }
        checkedIcon={
          <EmojiToggle role="img" aria-label="sun">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            {'☀️'}
          </EmojiToggle>
        }
        onChange={() => {
          ReactGA.event({
            category: 'Advanced Interaction',
            action: 'Toggle Theme',
            label: isDark ? 'Light' : 'Dark'
          })
          toggleDarkMode()
        }}
      />
    </FooterFrame>
  )
}
