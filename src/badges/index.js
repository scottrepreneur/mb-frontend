
const badgeList = {
  MKR1: {
    name: 'Earn $1 in interest from DSR',
    longName: 'Earn $1 in interest from<br>the Dai Savings Rate',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://oasis.app/save',
    steps: {
      1: '',
    },
    imgPath: 'dsr-badge.svg',
    redeemed: 1,
    unlocked: 1,
  },
  MKR2: {
    name: 'Vote on a Governance Poll',
    longName: 'Vote on one Governance Poll',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'poll-badge.svg',
    unlocked: 1,
    redeemed: 1,
  },
  MKR3: {
    name: 'Vote on an Executive Vote',
    longName: 'Vote on one Executive Vote<br>to enact a new Proposal',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'executive-badge.svg',
    unlocked: 1,
    redeemed: 0,
  },
  MKR4: {
    name: 'Vote on 5 Governance Polls',
    longName: 'Vote on at least 5 Governance Polls',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'polls-x5-badge.svg',
    unlocked: 1,
    redeemed: 0,
  },
  MKR5: {
    name: 'First Executive Voter',
    longName: 'Be one of the first voters on<br>a new Executive Proposal',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'quick-vote-spell-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
  MKR6: {
    name: 'Enact a Proposal',
    longName: 'Cast the Spell to enact the<br>proposal contained in the Spell',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://etherscan.io',
    imgPath: 'cast-spell-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
  MKR7: {
    name: 'MKR in Voting Contract for 3 months',
    longName: 'Secure MKR Governance with your<br>MKR for at least 3 months',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'lock-mkr-x3-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
  MKR8: {
    name: 'MKR in Voting Contract for 12 months',
    longName: 'Secure MKR Governance with your<br>MKR for at least 12 months',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'lock-mkr-x12-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
  MKR9: {
    name: 'Create a Proposal that gets 10 votes',
    longName: 'Create an Executive Proposal that<br>accumulates at least 10 voters',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'spell-10-votes-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
  MKR10: {
    name: 'Create a Proposal that is passed',
    longName: 'Create an Executive Proposal<br>that is passed by MKR Governance',
    description: 'Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    resource: 'https://vote.makerdao.com',
    imgPath: 'spell-is-cast-badge.svg',
    unlocked: 0,
    redeemed: 0,
  },
}


export const fetchBadgeList = async function(account) {
  return Promise.all(
    Object.keys(badgeList).map(async (key) => {
      let badge = badgeList[key]
      return badge
    })
  )
}
