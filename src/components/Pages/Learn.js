import React, { useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  NavBar,
  Footer,
  ContentContainer,
  Gutter,
  Icon,
} from "../../components";
import colors from "../../config/colors";
// import colors from '../../config/colors';
const LearnPage = styled(ContentContainer)`
  background: white;
  max-width: 100%;
  padding: 0;
  h1 {
    font-size: 4rem;
    text-align: center;
  }
  h2 {
    font-size: 1.75rem;
    font-weight: normal;
    letter-spacing: initial;
    text-align: center;
    max-width: 60ch;
  }
`;

const FullHeightContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ dark }) => (dark ? colors.darkgray : "initial")};
  color: ${({ dark }) => (dark ? colors.white : "initial")};
  *,
  div * {
    color: ${({ dark }) => (dark ? colors.white : "initial")};
  }
`;
const FullHeightContent = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TopicGridLink = styled(NavLink)`
  padding: 1rem;
  border: 1px solid ${colors.lightblue}55;
  display: block;
  text-align: center;
  color: white !important;
  font-weight: normal !important;
  font-size: 1.25rem !important;
  transition: border 0.2s ease-in-out;
  border-radius: 0.25em;
  &:hover {
    border: 1px solid ${colors.lightblue};
  }
`;

const UseCaseContent = styled(Grid)``;

const UseCaseImage = styled(Grid)`
  position: relative;
  img {
    max-width: 100%;
  }
  div {
    background: ${colors.darkgray};
    padding:1em;
    width:fit-content;
    height:fit-content;
  }
  p {
    color:${colors.lightgray};
    font-size:1rem;
    text-align: center;
  }
  svg {
    max-width: 2rem;
    margin:0 auto;
    display:block;
  }
`;

const UseCaseText = styled(Grid)`
  h1,
  h2 {
    text-align: left;
    margin-bottom: 2em;
  }
  h3 {
    font-size: 3rem;
  }

  p,
  ul li,
  ul li a,
  h4,
  span {
    font-size: 1.125rem;
    line-height: 1.25;
  }
  p,
  ul,
  span,
  h4 {
    margin-top: 1em;
  }
  h4 {
    font-family: "Playfair Display", serif;
  }
`;

const RoleContainer = styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const RoleButton = styled(Button)`
  text-transform: none;
  font-size: 1.5rem;
  flex-direction: column;
  padding:1em 2em;
  /* white-space: nowrap; */
`;

const RoleIcon = styled.div`
  width: 4rem;
  height: 4rem;
  display: block;
  margin-bottom: 1rem;
  svg {
    fill: ${({ color }) => color};
    stroke: ${({ color }) => color};
  }
`;

const TutorialsAndDemos = [
  {
    title: "Getting Started: Atlas 101",
    description: "Your first stop: An introduction to the US Covid Atlas",
    slug: "getting-started",
  },
  {
    title: "Basic Thematic Maps",
    description: "Create maps to visualize data using color, shading, and shape",
    slug: "thematic-maps",
  },
  {
    title: "Spatial and Time Scales",
    description: "Explore data with spatial and time visualization features",
    slug: "spatial-time-scales",
  },
  {
    title: "Hotspot Maps",
    description: "Identify area hotspots and 'coldspots' using spatial analysis",
    slug: "hotspot-maps",
  },
  {
    title: "Community Contexts",
    description: "Explore community health data, identify nearby resources, and overlay impacted communities",
    slug: "community-contexts",
  },
  {
    title: "Emerging Trends",
    description: "Explore how trends emerge and evolve over time",
    slug: "emerging-trends",
  },
  {
    title: "Sharing Data & Findings",
    description: "Learn  to download data and embed and share maps directly",
    slug: "sharing-data",
  },
  {
    title: "Community Reports",
    description: "Create custom community data reports in an easy-to-share format",
    slug: "community-reports",
  },
  {
    title: "Add Custom Data",
    description: "Load your own spatial data and create custom visualizations",
    slug: "add-custom-data",
  },
];

const Roles = [
  {
    title: "Public Health",
    sectionId: "health",
    icon: "health",
    iconColor: "skyblue",
  },
  {
    title: "Policy",
    sectionId: "policy",
    icon: "policy",
    iconColor: "orange",
  },
  {
    title: "Advocacy",
    sectionId: "advocacy",
    icon: "advocacy",
    iconColor: "yellow",
  },
  {
    title: "Research",
    sectionId: "research",
    icon: "research",
    iconColor: "lightgray",
  },
  {
    title: "Media",
    sectionId: "media",
    icon: "media",
    iconColor: "green",
  },
];

const RolesContent = [
  {
    ref: "health",
    title: "Public Health",
    image: "/img/learn/public-health.jpeg",
    imageAlt: "",
    description:
      " ",
    topics: [
      {
        text: "Test1",
        link: "/learn/load-your-own-data",
      },
      {
        text: "Test2",
        link: "/learn/create-a-reprot",
      },
      {
        text: "Test3",
        link: "/learn/examine-change-over-time",
      },
    ],
    quote: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      author: "Jay Bhatt, Primary Health Physician and Media Correspondent",
    },
    background: "#e79b45",
    icon: "health",
    iconText: "Public Health",
  },
  
  {
    ref: "policy",
    title: "Policy",
    image: "/img/learn/hand-book.jpg",
    imageAlt: "",
    description:
      "Use the U.S COVID Atlas to inform public health safety guidelines and evaluate policy and governance. ",
    topics: [
      {
        text: "Load your own zip-code level data",
        link: "/learn/load-your-own-data",
      },
      {
        text: "Create a customizable report",
        link: "/learn/create-a-reprot",
      },
      {
        text: "Examine change over time",
        link: "/learn/examine-change-over-time",
      },
    ],
    quote: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      author: "Jay Bhatt, Primary Health Physician and Media Correspondent",
    },
    background: "#D8D8D8",
    icon: "policy",
    iconText: "Policy",
  },

  {
    ref: "advocacy",
    title: "Advocacy",
    image: "/img/learn/advocacy.jpeg",
    imageAlt: "",
    description:
      "Use the U.S COVID Atlas to identify and advocate for vulnerable neighborhoods and promote targetted public safety measures. ",
    topics: [
      {
        text: "Load your own zip-code level data",
        link: "/learn/load-your-own-data",
      },
      {
        text: "Create a customizable report",
        link: "/learn/create-a-reprot",
      },
      {
        text: "Examine change over time",
        link: "/learn/examine-change-over-time",
      },
    ],
    quote: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      author: "Jay Bhatt, Primary Health Physician and Media Correspondent",
    },
    background: "#e8d48e",
    icon: "advocacy",
    iconText: "Advocacy",
  },

  {
    ref: "research",
    title: "Research",
    image: "/img/learn/research.jpeg",
    imageAlt: "",
    description:
      "Use the U.S COVID Atlas to explore trends in COVID case rates, vaccinations, hospitalizations, and variation between tract & zip-codes to understand inequities and support advocacy and governance efforts.",
    topics: [
      {
        text: "Load your own zip-code level data",
        link: "/learn/load-your-own-data",
      },
      {
        text: "Create a customizable report",
        link: "/learn/create-a-reprot",
      },
      {
        text: "Examine change over time",
        link: "/learn/examine-change-over-time",
      },
    ],
    quote: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      author: "Jay Bhatt, Primary Health Physician and Media Correspondent",
    },
    background: "#d8d8d8",
    icon: "research",
    iconText: "Research",
  },

  {
    ref: "media",
    title: "Media",
    image: "/img/learn/media.jpeg",
    imageAlt: "",
    description:
      "Media and journalists ",
    topics: [
      {
        text: "Load your own zip-code level data",
        link: "/learn/load-your-own-data",
      },
      {
        text: "Create a customizable report",
        link: "/learn/create-a-reprot",
      },
      {
        text: "Examine change over time",
        link: "/learn/examine-change-over-time",
      },
    ],
    quote: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      author: "Jay Bhatt, Primary Health Physician and Media Correspondent",
    },
    background: "#e79b45",
    icon: "media",
    iconText: "media",
  },
  
];

export default function Learn() {
  const tutorialsRef = useRef(null);
  const policyRef = useRef(null);
  const advocacyRef = useRef(null);
  const researchRef = useRef(null);
  const publicAwarenessRef = useRef(null);

  const sections = {
    tutorials: tutorialsRef,
    "policy": policyRef,
    advocacy: advocacyRef,
    research: researchRef,
    "public-awareness": publicAwarenessRef,
  };

  const handleScroll = (sectionId) => {
    sections[sectionId]?.current &&
      sections[sectionId].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <LearnPage>
      <NavBar light />
      <FullHeightContainer dark>
        <FullHeightContent>
          <Typography variant="h1" element="h1">
            A Guide to the Atlas
          </Typography>
          <Typography variant="h2" element="h2">
            The Atlas helps you access current, validated county-level data and
            spatial analysis to better understand the spread in communities and
            to bolster planning efforts. Scroll to access tutorials, explore
            uses by role, and more.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleScroll("tutorials")}
            sx={{
              fontSize: "1.5rem",
              margin: "0 auto",
              display: "block",
              textTransform: "none",
              mt: 5,
            }}
          >
            Start Exploring the Atlas
          </Button>
        </FullHeightContent>
      </FullHeightContainer>
      <FullHeightContainer
        ref={tutorialsRef}
        dark
        style={{ background: colors.gray }}
      >
        <FullHeightContent>
          <Typography variant="h1" element="h2">
            Tutorials and Demos
          </Typography>
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
      <FullHeightContainer style={{ background: colors.teal }} dark>
        <FullHeightContent>
          <Typography variant="h1" element="h2">
            Explore by Role
          </Typography>
          <Typography variant="h2" element="h4">
            Choose a category
          </Typography>
          <RoleContainer>
            {Roles.map(({ title, sectionId, icon, iconColor }) => (
                <RoleButton onClick={() => handleScroll(sectionId)} ley={sectionId}>
                  <RoleIcon color={iconColor}>
                    <Icon symbol={icon} style={{ width: "4rem" }} />
                  </RoleIcon>
                  {title}
                </RoleButton>
            ))}
          </RoleContainer>
        </FullHeightContent>
      </FullHeightContainer>
      {RolesContent.map(
        ({
          ref,
          title,
          image,
          imageAlt,
          description,
          topics,
          quote,
          background,
          icon,
          iconText,
        }) => (
          <FullHeightContainer ref={sections[ref]} style={{ background }}>
            <FullHeightContent>
              <UseCaseContent container spacing={5} sx={{ py: 4 }}>
                <UseCaseImage item xs={12} sm={6}>
                  <img src={image} alt={imageAlt} />

                  <RoleIcon
                    color={colors.lightgray}
                    style={{
                      position: "absolute",
                      right: ".5em",
                      top: "3.5em",
                    }}
                  >
                    <Icon symbol={icon} style={{ width: "4rem" }} />
                    <Typography>{iconText}</Typography>
                  </RoleIcon>
                </UseCaseImage>
                <UseCaseText
                  item
                  xs={12}
                  sm={6}
                  style={{ position: "relative", textAlign: "left" }}
                >
                  <Typography variant="h3" element="h3">
                    {title}
                  </Typography>
                  <Typography element="p">{description}</Typography>
                  <Gutter h={"4em"} />
                  <Typography element="p">
                    Sample Use Cases and Tutorial:
                  </Typography>
                  <ul>
                    {topics.map(({ text, link }) => (
                      <li key={text}>
                        <a href={link}>{text}</a>
                      </li>
                    ))}
                  </ul>
                  <Typography variant="h4" element="h4">
                    {quote.text}
                  </Typography>
                  <Typography variant="h4" element="h4">
                    {quote.author}
                  </Typography>
                </UseCaseText>
              </UseCaseContent>
            </FullHeightContent>
          </FullHeightContainer>
        )
      )}
      <Footer />
    </LearnPage>
  );
}
