import React, { Suspense, lazy } from 'react'
import styled from 'styled-components'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import Web3ReactManager from '../components/Web3ReactManager'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { getAllQueryParams } from '../utils'
import { useBadgeAdminStatus } from '../contexts/Application'

const Redeem = lazy(() => import('./Redeem'))
const Admin = lazy(() => import('./Admin'))

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`
const FooterWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  align-self: flex-end;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
`

const Body = styled.div`
  max-width: 60rem;
  width: 80%;
  /* margin: 0 1.25rem 1.25rem 1.25rem; */

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 90%;
    max-width: none;
  `}
`

export default function App() {
  const params = getAllQueryParams()
  const isBadgeAdmin = useBadgeAdminStatus()

  return (
    <>
      <Suspense fallback={null}>
        <AppWrapper>
          <HashRouter>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Body>
                <Web3ReactManager>
                  {/* this Suspense is for route code-splitting */}
                  <Suspense fallback={null}>
                    <Switch>
                      <Route exact strict path="/redeem" component={() => <Redeem params={params} />} />
                      {isBadgeAdmin === true && (
                        <Route exact strict path="/admin" component={() => <Admin params={params} />} />
                      )}
                      <Redirect to="/redeem" />
                    </Switch>
                  </Suspense>
                </Web3ReactManager>
              </Body>
            </BodyWrapper>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
          </HashRouter>
        </AppWrapper>
      </Suspense>
    </>
  )
}
