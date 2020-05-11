import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import Modal from '../Modal'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin: auto;
  position: relative;
`

const Closer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`

const Name = styled.div`
  margin-top: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  width: 80%;
  text-align: center;
  overflow-wrap: balance;
`

const Image = styled.div`
  margin-top: 20px;
`

const Stage = styled.div`
  margin-top: 5px;
  background-color: ${({ theme }) => theme.badgeShadow};
  width 75px;
  height: 22px;
  border-radius: 80px / 20px;
`

const Description = styled.div`
  margin: 20px auto;
  width: 70%;
  font-size: 0.8rem;
`

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 15px;
`

const Resource = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.makerTeal};

  :hover {
    text-decoration: underline;
  }
`

const Redeemed = styled.div`
  color: ${({ theme }) => theme.makerTeal};
`

const Redeem = styled.button`
  width: 100px;
  height: 25px;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.makerTeal};
  border: 1px solid ${({ theme }) => theme.white};
  font-weight: bold;

  :hover {
    cursor: pointer;
    box-shadow: 1px 2px 2px ${({ theme }) => theme.makerTeal};
  }
`

export default function BadgeModal({ badge, isOpen, onDismiss }) {

  return (
    <Modal
      style={{ userSelect: 'none' }}
      isOpen={isOpen}
      onDismiss={onDismiss}
      minHeight={null}
      maxHeight={90}
    >
      {badge &&
        <Wrapper>
          <Closer>X</Closer>
          <Name dangerouslySetInnerHTML={{ __html: badge.longName }} />
          <Image> 
            <img src={require('../../assets/images/' + badge.imgPath)} alt={badge.name} />
          </Image>
          <Stage />
          <Description>
            {badge.description}
          </Description>
          <Footer>
            { badge.unlocked && badge.redeemed ? <Redeemed>Redeemed!</Redeemed> : null }
            { !badge.unlocked && <Redeemed>Progress: 0%</Redeemed> }
            <Resource href={badge.resource}> {badge.resource} {'→'} </Resource>
            { badge.unlocked && !badge.redeemed ? <Redeem>Redeem</Redeem> : null }
          </Footer>
        </Wrapper>
      }
    </Modal>
  )
}
