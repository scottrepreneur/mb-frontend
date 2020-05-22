import React from 'react'
import styled from 'styled-components'

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

const Closer = styled.img`
  position: absolute;
  top: 15px;
  right: 15px;
  height: 15px;
  width: 15px;
  color: ${({ theme }) => theme.buttonOutlineGrey};

  :hover {
    cursor: pointer;
  }
`

const Name = styled.div`
  margin-top: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  width: 80%;
  text-align: center;
  overflow-wrap: balance;
`

const Badge = styled.div`
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

const Status = styled.div`
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

export default function BadgeModal({ badge, isOpen, onDismiss, onRedeem }) {

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
          <Closer 
            src={require('../../assets/images/x.svg')} 
            alt="close modal" 
            onClick={() => {
              onDismiss()
            }} 
          />
          <Name dangerouslySetInnerHTML={{ __html: badge.longName }} />
          <Badge> 
            <img 
              src={require('../../assets/images/' + badge.imgPath)} 
              alt={badge.name} 
            />
          </Badge>
          <Stage />
          <Description>
            {badge.description}
          </Description>
          <Footer>
            { badge.unlocked && badge.redeemed 
              ? <Status>Redeemed!</Status> 
              : null 
            }
            { !badge.unlocked && <Status>Progress: 0%</Status> }
            <Resource 
              href={badge.resource} 
              target="_blank" 
              rel="noopener noreferrer"
            > 
              {badge.resource} {'→'} 
            </Resource>
            { badge.unlocked && !badge.redeemed 
              ? <Redeem onClick={() => onRedeem(badge.proof, badge.id)}>Redeem</Redeem> 
              : null 
            }
          </Footer>
        </Wrapper>
      }
    </Modal>
  )
}
