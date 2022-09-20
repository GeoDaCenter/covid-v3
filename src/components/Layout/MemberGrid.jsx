import styled from 'styled-components'
import { Grid } from '@mui/material'

const TeamBio = styled(Grid)`
  display: flex;
  h4 {
    font-size: 1rem;
  }
  h5 {
    font-size: 1rem;
    padding: 0 0 0.5em 0;
    font-weight: normal;
    font-style: italic;
  }
  img {
    max-width: 10em;
    padding-bottom: 2em;
    width: 100%;
    align-self: flex-start;
  }
  span {
    padding-left: 1em;
  }
`

/**
 * Renderer for single member
 *
 * @category Components/Layout
 * @param {Object} props
 * @param {Member} props.member - Member info
 * @param {number} props.columns - Number of columns in the grid
 * @component
 */
const CoreMemberBio = ({ member, columns }) => (
  <TeamBio item xs={12} {...columns}>
    <img
      src={`${process.env.PUBLIC_URL}/img/people/${member.img}`}
      alt={`${member.name}`}
    />
    <span>
      <h4>{member.name}</h4>
      <h5>{member.title}</h5>
      {!!member.bio && <p>{member.bio}</p>}
    </span>
  </TeamBio>
)

/**
 * Grid of team members for use on about page
 *
 * @category Components/Layout
 * @param {Object} props
 * @param {Member[]} props.members - Array of members
 * @param {number} props.columns - Number of columns in grid
 * @component
 */
export default function MemberGrid({ members, columns }) {
  return (
    <Grid container spacing={2}>
      {members.map((member) => (
        <CoreMemberBio member={member} columns={columns} />
      ))}
    </Grid>
  )
}

/**
 * @typedef {Object} Member
 * @property {string} name - Name of the member
 * @property {string} title - Job title
 * @property {string} img - Path to image file in /img/people
 * @property {string} bio - Bio of the member
 */
