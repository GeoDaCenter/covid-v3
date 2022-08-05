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
  HintBox,
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
  a {
    text-decoration: underline;
    font-weight: 300;
  }
`;


const ButtonsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin:0 auto;
`

const CTAButton = styled(Button)`
  display:inline-block;
  font-size: 1.5rem;
  text-transform: none;
  padding: .25em 1em;
`

const CTALink = styled.a`
  display:inline-block;
  font-size: 1.5rem !important;
  text-transform: none;
  background: ${colors.teal}88;
  color: ${colors.white};
  padding: .35em 1em;
  font-weight: light !important;
  margin-left: .5rem;
  border-radius:.125em;
  transition:250ms all;
  &:hover {
    background: ${colors.teal};
  }

`
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
    width:100%;
  }
  div {
    background: ${colors.darkgray};
    padding:1em;
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

const RoleTutorialList = styled.ul`
  list-style:none;
  li {
    margin-bottom:.75rem;
    a {font-weight: bold;}
  }
`

const RolePressList = styled.ul``

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
    title: "Trends Over  time",
    description: "Explore how trends emerge and evolve over time",
    slug: "trends-over-time",
  },
  {
    title: "Sharing Data & Findings",
    description: "Learn  to download data and embed and share maps directly",
    slug: "sharing-data",
  },
  {
    title: "Community Reports",
    description: "Create custom community data reports in an easy-to-share format",
    slug: "create-a-report",
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
    <span> <b>Public health professionals need access to reliable data easily accessible data.</b> The US Covid Atlas can help fill in the gaps. The Atlas lets you explore trends over time to understand and inform public health decisions. Grab screenshots of maps, share a unique link to a specific county map view, or embed an Atlas map view on your website to bolster public outreach and communications. </span>
      ,
    topics: [
      {
        text: "Creating Thematic Maps",
        link: "/learn/thematic-maps",
      },
      {
        text: "Exploring Changes Over Time",
        link: "/learn/trends-over-time",
      },
      {
        text: "Sharing Data and Findings",
        link: "/learn/sharing-data",
      },
    ],
    useCasesTitle: "How has the Atlas been used in public health?",
    useCases: [
      {
        text: "Assessing spatial and racial disparities in COVID-19 mortality",
        link: "https://medium.com/covidatlas/assessing-spatial-racial-disparities-in-covid-19-mortality-fbd2e389a33e",
      },
      {
        text: "Understanding how COVID was impacting rural areas early in the pandemic",
        link: "https://www.youtube.com/watch?v=uqGXzWCD9Xk",
      },
      {
        text: "Exploring where new hotspots were forming during the Delta variant wave",
        link: "https://www.youtube.com/watch?v=uqGXzWCD9Xk",
      },
    ],
    quote: {
      text: 
      <span>Want to be featured here? <a href="/contact">Let us know</a> how you use the Atlas.</span>,
      author: "",
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
      <span><b>Policy relies on data-driven evidence.</b> Policymakers and staff can explore the impacts of events in their communities using Atlas data and tools. Create a customizable Community Report to communicate data and findings in an easy-to-share online or printable format. Present data tables, maps, and line charts to communicate with stakeholders. Analyze the impact of policy responses over time with temporal exploration.
        </span>,
    topics: [
      {
        text: "Creating Thematic Maps",
        link: "/learn/thematic-maps",
      },
      {
        text: "Spatial and Time Scales",
        link: "/learn/spatial-time-scales",
      },
      {
        text: "Customizable Community Reports",
        link: "/learn/create-a-report",
      },
    ],
    useCasesTitle: "How has the Atlas been used in policy contexts?",
    useCases: [
      {
        text: "Mapping Michigan’s COVID-19 rates alongside local school district masking policies",
        link: "https://medium.com/covidatlas/masking-rules-in-michigan-schools-covid-data-and-citizen-science-3127a3f1669b",
      },
      {
        text: "Evaluating the impact of early COVID outbreaks on food supply chains and workers",
        link: "https://medium.com/covidatlas/unpacking-the-covid-outbreaks-in-the-meatpacking-industry-2c03ffe8264d",
      },
    ],
    quote: {
      text: <span>Want to be featured here? <a href="/contact">Let us know</a> how you use the Atlas.</span>,
      author: "",
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
      <span>
        <b>Strengthen your advocacy with pandemic data linked to community statistics and social determinants of health.</b> Click on counties for more information on health and socioeconomic indicators, like median income and percent of essential workers. Overlay boundaries of disproportionately impacted communities such as hypersegregated cities and federal Native American Reservations. Visualize racial and ethnic group populations by county to compare with COVID trends.
      </span>,
    topics: [
      {
        text: "Explore Community Contexts",
        link: "/learn/community-contexts",
      },
      {
        text: "Share Data and Findings",
        link: "/learn/sharing-data",
      },
      {
        text: "Add Custom Data",
        link: "/learn/add-custom-data",
      },
    ],
    useCasesTitle: "How has the Atlas been used in advocacy?",
    useCases: [
      {
        text: "Evaluating conditions in the Arkansas Delta to help make care decisions for aging family members",
        link: "https://medium.com/covidatlas/using-the-u-s-covid-atlas-in-the-arkansas-delta-dbddcf41fa01",
      },
      {
        text: "Calling attention to risks associated with in-person worship and religious gatherings during the pandemic",
        link: "https://medium.com/covidatlas/whats-wrong-with-these-people-f6ac287dbca3",
      },
      {
        text: "Advocating for more complex perspectives in public health maps, linking contexts of history and place",
        link: "https://www.statnews.com/2021/03/31/integrate-social-determinants-time-place-public-health-maps/",
      },
    ],
    quote: {
      text: <span>Want to be featured here? <a href="/contact">Let us know</a> how you use the Atlas.</span>,
      author: "",
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
      "Explore validated state- and county-level COVID rates and community contextual data from the start of the pandemic until today. The Atlas features data from multiple sources so you can visualize and compare trends across time and place. View raw totals or population-averaged rates for COVID and health indicators. Download data for your own independent research and analysis.",
    topics: [
      {
        text: "Hotspot Analysis and Maps",
        link: "/learn/hotspot-maps",
      },
      {
        text: "Identifying Trends Over Time",
        link: "/learn/trends-over-time",
      },
      {
        text: "Sharing Data and Fidings",
        link: "/learn/sharing-data",
      },
    ],
    useCasesTitle: "How has the Atlas been used in research?",
    useCases: [
      {
        text: "Assessing the structural barriers and racial group disparities of COVID-19 mortality with spatial analysis",
        link: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2789619",
      },
      {
        text: "Exploring dimensions of uncertainty with a spatiotemporal review of five COVID-19 datasets",
        link: "https://www.tandfonline.com/doi/full/10.1080/15230406.2021.1975311",
      },
      {
        text: "Creating a dynamic cyberinfrastructure for interactive exploration of the pandemic",
        link: "https://onlinelibrary.wiley.com/doi/10.1111/tgis.12786",
      },
    ],
    quote: {
      text: <span>Want to be featured here? <a href="/contact">Let us know</a> how you use the Atlas.</span>,
      author: "",
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
      "Report data and embed maps for fact-based journalism. Compare multiple validated county- and state-level data sources for the entire country to check local reporting and case or vaccination trends. Look back to the day, week, or month of major events in your region and watch how COVID rates changed. Download data to conduct analyses for further reporting and investigation.",
    topics: [
      {
        text: "Identifying Trends Over Time",
        link: "/learn/trends-over-time",
      },
      {
        text: "Understanding Community Contexts",
        link: "/learn/community-contexts",
      },
      {
        text: "Creating Thematic Maps",
        link: "/learn/thematic-maps",
      },
    ],
    useCasesTitle: "How has the Atlas been used in media and journalism?",
    useCases: [
      {
        text: "Investigating the link between COVID-19 mortality and internet access",
        link: "https://www.vox.com/22979086/covid-pandemic-deaths-mortality-broadband-internet-access",
      },
      {
        text: "Reporting on holiday travel during pandemic and infection positivity rates",
        link: "https://www.nbcnews.com/meet-the-press/video/holiday-travel-busts-open-divided-political-and-vaccine-bubbles-127343685885",
      },
    ],
    quote: {
      text: <span>Want to be featured here? <a href="/contact">Let us know</a> how you use the Atlas.</span>,
      author: "",
    },
    background: "#e79b45",
    icon: "media",
    iconText: "Media",
  },
  
];

export default function Learn() {
  const tutorialsRef = useRef(null);
  const policyRef = useRef(null);
  const healthRef = useRef(null);
  const advocacyRef = useRef(null);
  const researchRef = useRef(null);
  const mediaRef = useRef(null);
  // const publicAwarenessRef = useRef(null);

  const sections = {
    tutorials: tutorialsRef,
    health: healthRef,
    policy: policyRef,
    advocacy: advocacyRef,
    research: researchRef,
    // "public-awareness": publicAwarenessRef,
    media: mediaRef,
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
          <ButtonsContainer>
            <CTAButton
              variant="outlined"
              color="primary"
              onClick={() => handleScroll("tutorials")}
            >
              Explore tutorials
            </CTAButton>
            
            <CTALink
              download
              href={`${process.env.PUBLIC_URL}/toolkit/Atlas Resource Guide.pdf`}
            >
              Download the Toolkit
            </CTALink>
          </ButtonsContainer>
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
          useCases,
          useCasesTitle,
          quote,
          background,
          icon
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
                    Get started with these relevant tutorials:
                  </Typography>
                  <RoleTutorialList>
                    {topics.map(({ text, link }) => (
                      <li key={text}>
                        <a href={link}>{text}</a>
                      </li>
                    ))}
                  </RoleTutorialList>
                  <Gutter h={"4em"} />
                  <Typography element="p" sx={{fontWeight: 'bolder'}}>
                    {useCasesTitle}
                  </Typography>
                  <RolePressList>
                    {useCases.map(({ text, link }) => (
                      <li key={text}>
                        <a href={link}>{text}</a>
                      </li>
                    ))}
                  </RolePressList>
                  
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
