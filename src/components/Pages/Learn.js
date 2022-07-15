import { Button, Grid, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { NavBar, Footer, ContentContainer, Gutter,Icon } from '../../components';
import colors from '../../config/colors';
// import colors from '../../config/colors';
const LearnPage = styled(ContentContainer)`
  background: white;
  max-width:100%;
  padding:0;
  h1 {
    font-size: 4rem;
  }
  h2 { 
    font-size: 1.75rem; 
    font-weight: normal;
    letter-spacing: initial;
    text-align: center;
  }
`;

const FullHeightContainer = styled.div`
  min-height: 100vh;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const FullHeightContent = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 1rem;
`

const TopicGridLink = styled(NavLink)`
  padding: 1rem;
  background:${colors.red};
  display: block;
  text-align: center;
  color:white !important;
  font-weight: normal !important;
  font-size: 1.25rem !important;
`

const UseCaseContent = styled(Grid)`
  img {
    max-width:100%;
  }
`

const RoleButton = styled(Button)`

`

const TutorialsAndDemos = [
  {
    title: 'Load your own data',
    description: 'Placeholder description',
    slug: 'load-your-own-data',
  },
  {
    title: 'Identify Emerging Trends',
    description: 'Placeholder description',
    slug: 'identify-emerging-trends',
  },
  {
    title: 'Create a Choropleth Map',
    description: 'Placeholder description',
    slug: 'create-a-choropleth-map',
  },
  {
    title: 'Find Hotspots',
    description: 'Placeholder description',
    slug: 'find-hotspots',
  },
  {
    title: 'Create a Report',
    description: 'Placeholder description',
    slug: 'create-a-report',
  },
  {
    title: "Examine Change over Time",
    description: "Placeholder description",
    slug: "examine-change-over-time",
  },
  {
    title: "Find Hotspots",
    description: "Placeholder description",
    slug: "find-hotspots",
  },
  {
    title: 'Create a Report',
    description: 'Placeholder description',
    slug: 'create-a-report',
  },
  {
    title: "Examine Change over Time",
    description: "Placeholder description",
    slug: "examine-change-over-time",
  }
]

const Roles = [
  {
    title: 'Policy & Governance',
    sectionId: 'policy-and-governance',
    icon: 'policy',
    iconColor: ''
  },
  {
    title: 'Advocacy',
    sectionId: 'advocacy',
    icon: 'advocacy',
    iconColor: ''
  },
  {
    title: 'Research',
    sectionId: 'research',
    icon: 'research',
    iconColor: ''
  },
  {
    title: 'Public Awareness',
    sectionId: 'public-awareness',
    icon: 'awareness',
    iconColor: ''
  }
]

const RolesContent = [
  {
    ref: 'advocacy',
    title: 'Are you a community Health Leader?',
    image: '/img/learn/highfive-team.jpg',
    imageAlt: '',
    description: 'Use the U.S COVID Atlas to identify and advocate for vulnerable neighborhoods and promote targetted public safety measures. ',
    topics: [
      {
        text: 'Load your own zip-code level data',
        link: ''
      },
      {
        text: 'Create a customizable report',
        link: ''
      },
      {
        text: 'Examine change over time',
        link: ''
      }
    ],
    quote: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      author: 'Jay Bhatt, Primary Health Physician and Media Correspondent'
    },
    background: '#e8d48e',
    icon: 'advocacy',
    iconText: 'Advocacy'
  },
  {
    ref: 'research',
    title: 'Are you a Public Health Researcher?',
    image: '/img/learn/book.jpg',
    imageAlt: '',
    description: 'Use the U.S COVID Atlas to explore trends in COVID case rates, vaccinations, hospitalizations, and variation between tract & zip-codes to understand inequities and support advocacy and governance efforts.',
    topics: [
      {
        text: 'Load your own zip-code level data',
        link: ''
      },
      {
        text: 'Create a customizable report',
        link: ''
      },
      {
        text: 'Examine change over time',
        link: ''
      }
    ],
    quote: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      author: 'Jay Bhatt, Primary Health Physician and Media Correspondent'
    },
    icon: 'research',
    iconText: 'research'
  },
  {
    ref: 'policy-and-governance',
    title: 'Are you a Public Health Officer?',
    image: '/img/learn/hand-book.jpg',
    imageAlt: '',
    description: 'Use the U.S COVID Atlas to inform public health safety guidelines and  evaluate policy and governance. ',
    topics: [
      {
        text: 'Load your own zip-code level data',
        link: ''
      },
      {
        text: 'Create a customizable report',
        link: ''
      },
      {
        text: 'Examine change over time',
        link: ''
      }
    ],
    quote: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      author: 'Jay Bhatt, Primary Health Physician and Media Correspondent'
    },
    background: '#e79b45',
    icon: 'policy',
    iconText: 'Policy & Governance'
  },
]

export default function Learn() {
  const tutorialsRef = useRef(null);
  const policyRef = useRef(null);
  const advocacyRef = useRef(null);
  const researchRef = useRef(null);
  const publicAwarenessRef = useRef(null);

  const sections = {
    'tutorials': tutorialsRef,
    'policy-and-governance': policyRef,
    'advocacy': advocacyRef,
    'research': researchRef,
    'public-awareness': publicAwarenessRef
  }

  const handleScroll = (sectionId) => {
    sections[sectionId]?.current && (
      sections[sectionId].current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    )
  }

  return (
    <LearnPage>
      <NavBar light />
      <FullHeightContainer>
        <FullHeightContent>
          <Typography variant="h1" element="h1">A Guide to the Atlas</Typography>
          <Typography variant='h2' element='h2'>
            The Atlas helps you access current, validated county-level
            data and spatial analysis to better understand the
            spread in communities and to bolster planning efforts.
            Scroll to access tutorials, explore uses by role, and more.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleScroll('tutorials')}>Start Exploring the Atlas</Button>
        </FullHeightContent>
      </FullHeightContainer>
      <FullHeightContainer ref={tutorialsRef}>
        <FullHeightContent>
          <Typography variant="h1" element="h2">Tutorials and Demos</Typography>
          <Grid container spacing={3} sx={{ py: 4 }}>
            {TutorialsAndDemos.map(({ title, description, slug }) => (
              <Grid item xs={12} sm={4} key={slug}>
                <TopicGridLink to={`/learn/${slug}`}>
                  <b>{title}</b>
                  <br />
                  {description}
                </TopicGridLink>
              </Grid>
            ))}
          </Grid>
        </FullHeightContent>
      </FullHeightContainer>
      <FullHeightContainer>
        <FullHeightContent>
          <Typography variant="h1" element="h2">Explore by Role</Typography>
          <Typography variant="h2" element="h4">Choose a category</Typography>
          <Grid container spacing={3} sx={{ py: 4 }}>
            {Roles.map(({ title, sectionId, icon, iconColor }) => (
              <Grid item xs={12} sm={6} md={3} key={sectionId}>
                <RoleButton onClick={() => handleScroll(sectionId)}>
                  <Icon symbol={icon} style={{width:'4rem'}} />
                  {title}
                </RoleButton>
              </Grid>
            ))}
          </Grid>
        </FullHeightContent>
      </FullHeightContainer>
      {RolesContent.map(({ ref, title, image, imageAlt, description, topics, quote, background, icon, iconText }) => (
        <FullHeightContainer ref={sections[ref]} style={{ background }}>
          <FullHeightContent>
            <UseCaseContent container spacing={3} sx={{ py: 4 }}>
              <Grid item xs={12} sm={6}>
                <img src={image} alt={imageAlt} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h1" element="h2">{title}</Typography>
                <Typography variant="p" element="p">{description}</Typography>
                <Gutter h={2} />
                <Typography>Sample Use Cases and Tutorial:</Typography>
                <ul>
                  {topics.map(({ text, link }) => (
                    <li key={text}>
                      <a href={link}>{text}</a>
                    </li>
                  ))}
                </ul>
                <Typography variant="h2" element="h4">{quote.text}</Typography>
                <Typography variant="h2" element="h4">{quote.author}</Typography>
              </Grid>
            </UseCaseContent>
            {icon}
            {iconText}
          </FullHeightContent>
        </FullHeightContainer>
      ))}
      <Footer />
    </LearnPage>
  );
}
