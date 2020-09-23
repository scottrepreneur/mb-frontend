import fetch from 'cross-fetch'

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL

// HARDER TO TRACK IDEAS

//  Propose a new Maker project
//  Contribute to an existing project/bounty
//  Get a development grant
//  Translate content
//  Apply to be a translator
//  Apply to be a translator reviewer
//  Create new content for comm-dev
//  Edit existing content
//  Improve Maker knowledge
//  E.g. learn about vaults, voting, governance etc.
//  Get resources for working with Maker
//  E.g. writing style guide, visual style guide, assets
//  Join a governance meeting
//  Take notes at a meeting
//  Get Maker to take part in Hackathon (sponsorship/mentorship)

export function fetchBadgeList(account) {
  return new Promise((resolve, reject) => {
    fetch(BASE_API_URL + '/address/' + account)
      .then(res => {
        if (res.status >= 400) {
          reject()
        }
        return res.json()
      })
      .then(data => {
        resolve(data['badges'])
      })
  })
}
