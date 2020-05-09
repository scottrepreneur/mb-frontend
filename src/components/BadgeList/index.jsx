
import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-components'

import { useWeb3React } from '../../hooks'
import { lighten, darken } from 'polished'

const tempBadgeList = [
    {
        name: 'Earn $1 in interest from DSR',
        imgPath: 'dsr-badge.svg'
    },
    {
        name: 'Vote on a Governance Poll',
        imgPath: 'poll-badge.svg'
    },
    {
        name: 'Vote on an Executive Vote',
        imgPath: 'executive-badge.svg'
    },
    {
        name: 'Vote on 5 governance polls',
        imgPath: 'polls-x5-badge.svg'
    },
    {
        name: 'First Executive Voter',
        imgPath: 'quick-vote-spell-badge.svg'
    },
    {
        name: 'Cast a spell',
        imgPath: 'cast-spell-badge.svg'
    },
    {
        name: 'Lock MKR in Chief for 3 months',
        imgPath: 'lock-mkr-x3-badge.svg'
    },
    {
        name: 'Lock MKR in Chief for 12 months',
        imgPath: 'lock-mkr-x12-badge.svg'
    },
    {
        name: 'Create a Spell that gets 10 votes',
        imgPath: 'spell-10-votes-badge.svg'
    },
    {
        name: 'Create a Proposal that is passed',
        imgPath: 'spell-is-cast-badge.svg'
    },
]

const BadgesWrapper = styled.div`
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

const Badge = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 10rem;
    height: 13rem;
    padding: 10px;
    margin: 15px;
    border: 1px solid ${({ theme }) => darken(0.1, theme.backgroundColor)};
    background-color: ${({ theme }) => lighten(0.1, theme.backgroundColor)};
    box-shadow: 0px 4px 4px ${({ theme }) => darken(0.1, theme.backgroundColor)};
    border-radius: 5px;
`

export default function BadgeList({ initialCurrency, sending = false, params }) {

    return (
        <BadgesWrapper>
            {tempBadgeList.map(badge => {
                return(
                    <Badge key={badge.imgPath}>
                        <img src={require('../../assets/images/' + badge.imgPath)} alt={badge.name}/>
                        <p>{badge.name}</p>
                    </Badge>
                )
            })}
        </BadgesWrapper>
    )
}
