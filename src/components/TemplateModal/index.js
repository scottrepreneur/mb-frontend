import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from '../Modal'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  width: 100%;
  margin: auto;
  position: relative;
`

const Closer = styled.img`
  position: absolute;
  top: 15px;
  right: 15px;
  height: 15px;
  width: 15px;
  color: ${({ theme }) => theme.white};

  :hover {
    cursor: pointer;
  }
`

const Heading = styled.div`
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 60%;

  & > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    & > input {
      font-size: 15px;
      width: 200px;
      padding: 6px;
    }
  }
`

const Button = styled.button`
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

export default function BadgeModal({ isOpen, defaultBadge, onDismiss, onCreateTemplate }) {
  const [newBadge, setNewBadge] = useState({
    name: defaultBadge.name,
    description: defaultBadge.description,
    imgUrl: defaultBadge.imgPath,
  });

  const handleChange = (event) => {
    setNewBadge({
      ...newBadge,
      [event.target.id]: event.target.value
    });
  }

  const handleSubmit = (event) => {
    // alert('A name was submitted: ' + newBadge.name);
    event.preventDefault();
    onCreateTemplate(newBadge);
  }

  return (
    <Modal
      style={{ userSelect: 'none', position: 'relative' }}
      isOpen={isOpen}
      onDismiss={onDismiss}
      minHeight={null}
      maxHeight={90}
    >
      
      <Wrapper>
        <Closer 
          src={require('../../assets/images/x.svg')} 
          alt="close modal" 
          onClick={() => {
            onDismiss()
          }} />
        <Heading>
          Create Badge Template
        </Heading>

        <Form id="new-template">
          <div>
            <label for="name">Name:</label>
            <input 
              id="name" 
              type="text" 
              value={newBadge.name} 
              onChange={handleChange}
              />
          </div>
          <div>
            <label for="description">Description:</label>
            <input 
              id="description" 
              type="text" 
              value={newBadge.description} 
              onChange={handleChange} 
              />
          </div>
          <div>
            <label for="imgUrl">Image URL:</label>
            <input 
              id="imgUrl" 
              type="text" 
              value={newBadge.imgUrl}
              onChange={handleChange} 
              />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
            <Button onClick={handleSubmit}>
              Create
            </Button>
          </div>
        </Form>
      </Wrapper>
    </Modal>
  )
}
