import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

import { useBadgeList, useRootHashes } from '../../contexts/Application'
import { useInsigniaContract, useFactoryContract } from '../../hooks'
import TemplateModal from '../TemplateModal'

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
  grid-template-rows: auto auto;
  grid-template-areas: "image name create add"\n"root root root root";

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
  grid-area: root;
  height: 24px;
  width: 450px;
  margin: auto;
  padding-left: 5px;
  border-radius: 5px
`


export default function AdminList() {
  const badgeList = useBadgeList()

  const rootHashes = useRootHashes()

  const [newHashes, setNewHashes] = useState([]);

  const [showModal, setShowModal] = useState(false)

  const insignia = useInsigniaContract();
  const badgeFactory = useFactoryContract();

  async function onSetRootHashes() {
    let result = await insignia.setRootHashes(newHashes);
    console.log(result);
  }

  useEffect(function effectFunction() {
    setNewHashes(rootHashes)
  }, [rootHashes]);

  const handleChange = (event) => {
    setNewHashes(
      newHashes.map((id, hash) => {
        if (id === event.target.id) {
          return event.target.value
        }
        return hash
      }))
  }

  async function onCreateTemplate(template) {
    console.log(template)
    let result = await badgeFactory.createTemplate(
      template.name,
      template.description,
      template.imgUrl
    )
    
    console.log(result);
    return result;
  }

  return (
    <Wrapper>
      <TemplateModal
        isOpen={showModal}
        onCreateTemplate={(template) => onCreateTemplate(template)}
        onDismiss={() => {
          setShowModal(false)
        }} 
      />
      <Heading>
          <h1>Admin</h1>
          <RootHashes onClick={() => onSetRootHashes()}>Set Roots</RootHashes>
      </Heading>
      {Object.keys(badgeList).map(key => {
        const badge = badgeList[key]
        return(
          <div key={badge.id}>
            <Badge>
              <Image>
                <img
                  src={require('../../assets/images/' + badge.imgPath)} 
                  alt={badge.name}
                />
              </Image>
              
              <Name>
                {badge.name}
              </Name>
              <CreateButton created={false} onClick={() => setShowModal(true)}>
                <div>Create Badge</div>
              </CreateButton>
              <AddButton toAdd={true}>
                <div>+ Add Redeemers</div>
              </AddButton>
              {newHashes.length > 0 &&
                <Root 
                  type="text"
                  id={badge.id}
                  defaultValue={newHashes[badge.id - 1]}
                  onChange={handleChange}
                />}
            </Badge>
            <Break />
          </div>
        )
      })}
    </Wrapper>
  )
}
