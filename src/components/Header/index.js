import React from 'react'
import styled from 'styled-components'
import { withRouter, NavLink } from 'react-router-dom'
import { useMedia } from 'use-media'
import { darken } from 'polished'

import Web3Status from '../Web3Status'
import { useBadgeAdminStatus } from '../../contexts/Application'
import { MEDIA_WIDTHS } from '../../theme'

const tabOrder = [
  // {
  //   path: '/redeem',
  //   textKey: 'My Badges',
  //   regex: /\/redeem/,
  //   admin: false
  // },
  // {
  //   path: '/faq',
  //   textKey: 'FAQ',
  //   regex: /\/faq/,
  //   admin: false
  // },
  {
    path: '/admin',
    textKey: 'Admin',
    regex: /\/admin/,
    admin: true
  }
]

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.makerTeal};
`

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  #link {
    text-decoration: none;

    :hover {
      text-decoration-color: ${({ theme }) => theme.white};
    }
  }

  #title {
    display: inline;
    font-size: 24px;
    font-weight: 500;
    color: ${({ theme }) => theme.white};
    :hover {
      color: ${({ theme }) => darken(0.1, theme.white)};
    }
  }
`

const Links = styled.div``

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.white};
  margin: 0 15px;
  text-decoration: none;

  :hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.white};
  }

  &.${activeClassName} {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.white};
  }
`

function Header({ location: { pathname } }) {
  const isBadgeAdmin = useBadgeAdminStatus()

  const upToMedium = useMedia({ maxWidth: MEDIA_WIDTHS['upToMedium'].toString() + 'px' })

  return (
    <HeaderFrame>
      <HeaderElement>
        <Title>
          <NavLink id="link" to="/redeem">
            <h1 id="title">Maker Badges</h1>
          </NavLink>
        </Title>
      </HeaderElement>
      {!upToMedium && (
        <>
          <HeaderElement>
            <Links>
              {tabOrder.map(({ path, textKey, regex, admin }) =>
                isBadgeAdmin === true || admin !== true ? (
                  <StyledNavLink key={path} to={path} isActive={(_, { pathname }) => pathname.match(regex)}>
                    {textKey}
                  </StyledNavLink>
                ) : null
              )}
            </Links>
          </HeaderElement>
          <HeaderElement>
            <Web3Status />
          </HeaderElement>
        </>
      )}
    </HeaderFrame>
  )
}

export default withRouter(Header)
