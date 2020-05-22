import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { useBadgeList, useRootHashes } from '../../contexts/Application'

import { useInsigniaContract } from '../../hooks'

const Wrapper = styled.div``

const Heading = styled.div`
  h1 {
    margin-top: 30px;
    text-align: center;
  }
`

const RootHashes = styled.button`
`

const Image = styled.div`
  grid-area: image;
  display: grid;
  justify-content: center;
  align-items: center;

  img {
    width: 90%;
  }
`

const Name = styled.div`
  grid-area: name;
  display: flex;
  align-items: center;
  margin-left: 25px;
  font-weight: bold;
  font-size: 18px;
`

const Badge = styled.div`
  display: grid;
  grid-template-columns: 50px auto 175px 175px;
  grid-template-areas: "image name create add";
  height: 100px;
`

const CreateButton = styled.div`
  grid-area: create;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 25px;
    border-radius: 5px;
    color: ${({ theme, created }) => created ? theme.inactiveButton : theme.white };
    background-color: ${({ theme, created }) => created ? 0 : theme.makerTeal };
    border: 1px solid ${({ theme, created }) => created ? theme.inactiveButton : theme.makerTeal};
    font-weight: bold;
    font-size: 12px;
      
      :hover {
        cursor: ${({ created }) => created ? '' : 'pointer'};
        box-shadow: ${({ theme, created }) => created ? theme.inactiveButton : '1px 2px 2px' + lighten(0.2, theme.makerBlue)};
        border: ${({ theme, created }) => created ? theme.inactiveButton : '1px solid' + lighten(0.2, theme.makerBlue)};
      }
    }
    
  }
`

const AddButton = styled.div`
  grid-area: add;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 140px;
    height: 25px;
    border-radius: 5px;
    color: ${({ theme, toAdd }) => !toAdd ? theme.inactiveButton : theme.white };
    background-color: ${({ theme, toAdd }) => !toAdd ? 0 : theme.makerTeal };
    border: 1px solid ${({ theme, toAdd }) => !toAdd ? theme.inactiveButton : theme.makerTeal};
    font-weight: bold;
    font-size: 12px;

    :hover {
      cursor: ${({ created }) => created ? '' : 'pointer'};
      box-shadow: ${({ theme, created }) => created ? theme.inactiveButton : '1px 2px 2px' + lighten(0.2, theme.makerBlue)};
      border: ${({ theme, created }) => created ? theme.inactiveButton : '1px solid' + lighten(0.2, theme.makerBlue)};
    }
  }
`

const Break = styled.hr`
  height: 0;
  width: 80%;
  margin: 0 auto;
  border-top: 1px solid ${({ theme }) => theme.buttonOutlineGrey};
`

const Root = styled.input`
  height: 30px;
  width: 300px;
`


export default function AdminList() {
  const badgeList = useBadgeList()

  const rootHashes = useRootHashes();
  // console.log(rootHashes);

  const contract = useInsigniaContract();

  async function onSetRootHashes() {
    let result = await contract.functions.setRootHashes(rootHashes);
    console.log(result);
  }
  
  return (
    <Wrapper>
      <Heading>
          <h1>Admin</h1>
          <RootHashes onClick={() => onSetRootHashes()}>Set Roots</RootHashes>
      </Heading>
      {Object.keys(badgeList).map(key => {
        const badge = badgeList[key]
        return(
          <>
            <Badge key={badge.id}>
              <Image>
                <img
                  src={require('../../assets/images/' + badge.imgPath)} 
                  alt={badge.name}
                />
              </Image>
              
              <Name>
                {badge.name}
              </Name>
              <CreateButton created={false}>
                <div>Create Badge</div>
              </CreateButton>
              <AddButton toAdd={true}>
                <div>+ Add Redeemers</div>
              </AddButton>
              <Root type="text" defaultValue={rootHashes[badge.id - 1]} />
            </Badge>
            <Break />
          </>
        )
      })}
    </Wrapper>
  )
}
