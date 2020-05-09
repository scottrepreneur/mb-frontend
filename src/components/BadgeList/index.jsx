
import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-components'

import { useWeb3React } from '../../hooks'
import { lighten, darken } from 'polished'

const tempBadgeList = [
    {
        name: 'Earn $1 in interest from DSR',
        imgPath: 'dsr-badge.svg',
        redeemed: 1,
        unlocked: 1,
    },
    {
        name: 'Vote on a Governance Poll',
        imgPath: 'poll-badge.svg',
        unlocked: 1,
        redeemed: 1,
    },
    {
        name: 'Vote on an Executive Vote',
        imgPath: 'executive-badge.svg',
        unlocked: 1,
        redeemed: 0,
    },
    {
        name: 'Vote on 5 governance polls',
        imgPath: 'polls-x5-badge.svg',
        unlocked: 1,
        redeemed: 0,
    },
    {
        name: 'First Executive Voter',
        imgPath: 'quick-vote-spell-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
    {
        name: 'Cast a spell',
        imgPath: 'cast-spell-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
    {
        name: 'Lock MKR in Chief for 3 months',
        imgPath: 'lock-mkr-x3-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
    {
        name: 'Lock MKR in Chief for 12 months',
        imgPath: 'lock-mkr-x12-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
    {
        name: 'Create a Spell that gets 10 votes',
        imgPath: 'spell-10-votes-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
    {
        name: 'Create a Proposal that is passed',
        imgPath: 'spell-is-cast-badge.svg',
        unlocked: 0,
        redeemed: 0,
    },
]

const Heading = styled.div`
    h1 {
        margin-top: 30px;
        font-size: 20px;
        text-align: center;
    }
`

const BadgesWrapper = styled.div`
    margin-top: 10px;
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
    position: relative;

    :hover {
        cursor: pointer;
    }
`

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: ${({ theme }) => darken(0.1, theme.backgroundColor)};
    opacity: 0.5;
`

const RedeemButton = styled.button`
    width: 115px;
    height: 30px;
    z-index: 5;
    position: absolute;
    border-radius: 5px;
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.makerTeal};
    border: 0;
    font-weight: bold;

    :hover {
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.white};
    }
`

export default function BadgeList({ initialCurrency, sending = false, params }) {

    return (
        <>
            <Heading>
                <h1>My Badges</h1>
            </Heading>
            <BadgesWrapper>
                {tempBadgeList.map(badge => {
                    return(
                        <Badge key={badge.imgPath}>
                            {!badge.redeemed && <Overlay />}
                            {badge.unlocked && !badge.redeemed ? <RedeemButton>Redeem</RedeemButton>: null}
                            <img src={require('../../assets/images/' + badge.imgPath)} alt={badge.name}/>
                            <p>{badge.name}</p>
                        </Badge>
                    )
                })}
            </BadgesWrapper>
        </>
    )
}
