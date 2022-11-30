export const vote = /* GraphQL */ `
mutation AddVote($input: VoteInput!){
  plusOne(input: $input) {
    country
    guestId
    id
    text
    msgId
    createdAt
  }
}
`

export const onPlusOne = /* GraphQL */`
subscription OnPlusOne {
  onPlusOne {
    country
    guestId
    id
    msgId
    text
    createdAt
  }
}
`