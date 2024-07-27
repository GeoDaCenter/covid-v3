import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Box, Typography, Button, Modal } from "@mui/material";
import styled from "styled-components";

import Grid from "@mui/material/Grid";

import {
  NavBar,
  Geocoder,
  HeroMap,
  Footer,
  Icon,
  FastTrackInsights,
  Gutter,
  ContentContainer,
} from "../../components";
import { MAPBOX_ACCESS_TOKEN } from "../../config";
import colors from "../../config/colors";

import { VideoModal } from "../Interface/VideoModal";
import { red } from "@mui/material/colors";

const RolePressList = styled.ul``

const HomePage = styled.div`
  h1 {
    font-family: "Playfair Display", serif;
    font-size: 49px;
    font-weight: 300;
    text-align: left;
    font-style: italic;
    color: #d8d8d8;
    width: 80vw;
    max-width: 940px;
    margin: 0;
    font-size: 4rem;
    @media (max-width: 960px) {
      font-size: 2rem;
      width: 100%;
    }
  }
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
  hr {
    max-width: 1140px;
    margin: 6em auto;
    border: 0;
    border-top: 1px solid ${colors.skyblue};
  }
  p {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
  }
  .desktop-only {
    @media (max-width: 960px) {
      display: none;
    }
  }
  .mobile-only {
    @media (min-width: 960px) {
      display: none;
    }
  }
`;

const HomePageContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Hero = styled.div`
  width: 100%;
  max-width: 1140px;
  position: relative;
  text-align: center;
  color: ${colors.lightgray};
  margin: 0 auto;
  padding: 50px 10px 0 10px;
  @media (max-width: 960px) {
    padding-top: 10px;
  }
  z-index: 0;
  p {
    font-family: "Lato", sans-serif;
    font-size: 1.1rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #ededed;
    text-align: left;
    &.orText {
      padding: 0;
      margin: 0;
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 2.5;
    }
  }
  #button-cta {
    flex: auto;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.75px;
    line-height: 3;
    text-align: center;
    text-transform: uppercase;
    background-color: ${colors.orange};
    color: #0d0d0d;
    padding: 0 1.5rem;
    margin: 0;
    border-radius: 0.3rem;
    text-decoration: none;
    height: auto;
    @media (max-width: 960px) {
      max-width: 50%;
      margin: 0 auto;
    }
    @media (max-width: 600px) {
      max-width: 75%;
      margin: 0 auto;
    }
  }
  #HomeGeocoder {
    @media (max-width: 960px) {
      max-width: 56%;
      margin: 0 auto;
    }
    @media (max-width: 600px) {
      max-width: 75%;
      margin: 0 auto;
    }
  }
  .small-text {
    font-size: 0.75rem;
    a {
      font-size: 0.75rem;
      color: ${colors.orange};
      text-decoration: none;
    }
  }
  video {
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
  }
  .map-caption {
    font-size: 0.9rem;
    text-align: left;
  }
`;

const Features = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 60px auto 60px auto;
  h2 {
    font-family: "Playfair Display", serif;
    font-size: 28px;
    text-align: center;
    font-weight: normal;
    font-stretch: normal;
    font-style: italic;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: ${colors.skyblue};
    margin-bottom: 40px;
  }
`;

const Feature = styled(Grid)`
  text-align: center;
  h5 {
    font-family: "Playfair Display", serif;
    font-size: 19px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${colors.skyblue};
    margin-bottom: 20px;
  }
   h3 {
    font-family: "Playfair Display", serif;
    font-size: 19px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${colors.black};
    margin-bottom: 20px;
  }
  img {
    margin: 20px auto;
    width: 100%;
    max-width: 130px;
  }
  p {
    color: white;
    font-family: Lato;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.63;
    letter-spacing: normal;
    color: ${colors.white};
    @media (max-width: 960px) {
      max-width: 400px;
      margin: 0 auto 40px auto;
    }
  }
`;


const Features2 = styled.div`
  h5 {
    font-family: "Playfair Display", serif;
    font-size: 28px;
    text-align: center;
    font-weight: normal;
    font-stretch: normal;
    font-style: italic;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: ${colors.darkgray};
    margin-bottom: 40px;
  }
`;

const RoleIcon = styled.div`
  justify-content: center;
  width: 4rem;
  height: 4rem;
  display: block;
  margin-bottom: 1rem;
  svg {
    fill: ${colors.lightslategrey};
    stroke: ${colors.lightslategrey};
  }
`;

const BreakQuestion = styled.div`
  width: 100%;
  background-color: ${colors.skyblue};
  padding: 20px;
  h3 {
    font-family: "Playfair Display", serif;
    font-size: 28px;
    font-weight: normal;
    font-stretch: normal;
    font-style: italic;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: ${colors.gray};
  }
`;

const Arrow = styled.div`
  width: 35px;
  height: 35px;
  background-color: ${colors.skyblue};
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0px) rotate(-45deg);
`;

const UseCasesContainer = styled.div`
  background: white;
  width: 100%;
  padding: 40px 20px;
  padding-top: 40px;
`;
const UseCases = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  @media (max-width: 960px) {
    text-align: center;
  }
  video,
  img {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    display: block;
  }
  h5 {
    font-size: 1.5rem;
  }
  p {
    max-width: 600px;
    font-size: 16px;
    line-height: 1.7;
    @media (max-width: 960px) {
      margin: 0 auto;
    }
  }
`;

const NoBreak = styled.span`
  white-space: nowrap;
`;

const Usage = styled.span`
  background: ${(props) => colors[props.color]};
  padding: 10px 15px;
  border-radius: 15px;
  font-weight: bold;
  line-height: 4;
  font-size: 1rem;
  transform: translateY(-100%);
`;

const CenteredGrid = styled(Grid)`
  display: flex;
  align-content: center;
  padding-top: 4em;
`;

const MapWrapper = styled.div`
  position: relative;
  z-index: 0;
`;

const ExploreButton = styled(NavLink)`
  position: fixed;
  right: 50%;
  transform: translateX(50%);
  bottom: 1em;
  padding: 1em;
  background: ${colors.orange};
  font-size: 1.5rem;
  border-radius: 0.5em;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.43),
    -4px -7px 15px 5px rgba(0, 0, 0, 0.12);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.43),
    -4px -7px 15px 5px rgba(0, 0, 0, 0.12);
  color: black;
  font-weight: bold;
  text-decoration: none;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: 250ms all;
  z-index: 50000;
`;

const ModalContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 600px;
  background: ${colors.teal};
  color: ${colors.white};
`;


const ModalContentInner = styled.div`
  position: relative;
  padding: 2em;
  text-align: center;
  a {
    color: white !important;
    font-weight: bold;
  }
  h3 {
    font-size: 3rem;
    font-family: "Playfair Display", serif;
  }
  button {
    margin: .5em auto 0 auto;
    display: block;
  }
  p {
    font-size: 16px;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  color: ${colors.white};
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



function Home() {
  const [ctaActive, setCtaActive] = useState(false);
  const [storiesModal, setStoriesModal] = useState(true);
  const [videoModalInner, setVideoModalInner] = useState(false);

  const handleGeocoder = (e) => {
    let url = "";

    if (`${window.location.href}`.includes("index")) {
      url += `${window.location.href}`.split("index")[0];
    } else {
      url += window.location.href;
    }
    url += `map?lat=${e.center[1]}&lon=${e.center[0]}&z=6.5&v=2`;
    window.location.href = url;
  };
  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.pageYOffset > window.innerHeight && !ctaActive)
        setCtaActive(true);
      if (window.pageYOffset < window.innerHeight && ctaActive)
        setCtaActive(false);
    });
  }, []);

  return (
    <>
      <NavBar light />
      <HomePage>
        <HomePageContent>
          <Hero>
            <Gutter vh={5} />
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h1>
                  A Historic Exploration of the <NoBreak>COVID-19</NoBreak>{" "}
                  Pandemic
                </h1>
              </Grid>

              <Gutter vh={5} />

              <Grid
                item
                xs={12}
                md={5}
                style={{ display: "flex", alignItems: "center" }}
              >
                <p>
                The US Covid Atlas is a free visualization tool, report builder, 
                &amp; community toolkit that connects COVID case data and community indicators 
                across the United States from the beginning of the Pandemic. 
                <br/>
                <br/>
                  <span className="desktop-only">
                  The Atlas helps you access county-level data on COVID and the social determinants 
                  of health, use spatial analysis, and share stories to better understand the 
                  spread in communities and to bolster planning efforts.
                  </span>
                </p>
              </Grid>
              <Grid item xs={12} md={7}>
                <MapWrapper>
                  <HeroMap />
                </MapWrapper>
              </Grid>

              <Gutter h={20} />

              <CenteredGrid item xs={12} md={5} id="HomeGeocoder">
                <Geocoder
                  // id="HomeGeocoder"
                  placeholder={"Find your county..."}
                  API_KEY={MAPBOX_ACCESS_TOKEN}
                  onChange={handleGeocoder}
                  style={{
                    border: "6px solid white",
                    boxSizing: "content-box",
                    borderRadius: 0,
                  }}
                />
              </CenteredGrid>
              <CenteredGrid item xs={12} md={2}>
                <p className="orText">or</p>
              </CenteredGrid>
              <CenteredGrid item xs={12} md={5}>
                <NavLink to="/map" id="button-cta">
                  Start Exploring the Atlas
                </NavLink>
              </CenteredGrid>
              <Grid item xs={12}>
                <Gutter h={20} className="mobile-only" />
                <p className="mobile-only">
                  In a quickly changing pandemic landscape, our tool connects
                  COVID case data and community indicators across the United
                  States from its beginning to today. The Atlas helps you access
                  current, validated county-level data and spatial analysis to
                  better understand the spread in communities and to bolster
                  planning efforts.
                </p>
              </Grid>
            </Grid>

            <Gutter h={20} />
          </Hero>
           <FastTrackInsights /> 
          <Features>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h2>Atlas Features</h2>
              </Grid>
              <Feature item xs={12} md={3}>
                <img
                  src={`${process.env.PUBLIC_URL}/icons/regional-hot-spots.png`}
                  alt="Regional Hotspots"
                  loading="lazy"
                />
                <h5>
                  Track regional hotspots using spatial statistics
                </h5>
                <p>
                  Statistical clusters of both confirmed and daily new COVID
                  cases &amp; deaths, with and without population adjustment.
                </p>
              </Feature>
              <Feature item xs={12} md={3}>
                <img
                  src={`${process.env.PUBLIC_URL}/icons/spread-over-time-2@2x.png`}
                  alt="COVID Spread"
                  loading="lazy"
                />
                <h5>Watch COVID-19 spread across the country</h5>
                <p>
                  Watch the spread of accumulated or daily new COVID cases using
                  a time slider and live time-animation.
                </p>
              </Feature>
              <Feature item xs={12} md={3}>
                <img
                  src={`${process.env.PUBLIC_URL}/icons/county-level-data@2x.png`}
                  alt="County COVID Map"
                  loading="lazy"
                />
                <h5>Zoom in to focus down to the county level</h5>
                <p>
                  Uncover trends of the pandemic by comparing different data
                  sources, variables, and spatial analytic insights.
                </p>
              </Feature>
              <Feature item xs={12} md={3}>
                <img
                  src={`${process.env.PUBLIC_URL}/icons/comm-health-context@2x.png`}
                  alt="Community Health Contexts"
                  loading="lazy"
                />
                <h5>Tap into community and health contexts</h5>
                <p>
                  Connect to relevant social, economic, and health indicators to
                  provide meaningful community context.
                </p>
              </Feature>
            </Grid>
          </Features>
          <BreakQuestion>
            <h3>
              How can the Atlas be used to explore the Pandemic?
            </h3>
            <Arrow />
          </BreakQuestion>


          <UseCasesContainer>
            <UseCases>
              <Grid container spacing={5}>
                  <Grid item xs={12} md={8}>

                    <h1>Learn</h1>
                    <br /><br />
                    <p>
                    Explore tutorials, <a href="https://www.youtube.com/playlist?list=PLi9Z7UD_p9f8xEga76YV3FyLhiyL8twmm">video demos</a>, 
                    examples of how the Atlas is used in different fields with the <a href="https://uscovidatlas.org/learn"><i>Learn</i></a> toolkit. 
                    Get additional details on <a href="https://uscovidatlas.org/methods">analytical methods</a> used on the Atlas and learn 
                    about <a href="https://uscovidatlas.org/faq">frequently asked questions</a> posed during the Pandemic.
                    Educators can also get more background, context, and activities on
                    using the Atlas to support building <a href="https://alastore.ala.org/spatial-literacy-public-health-faculty-librarian-teaching-collaborations">
                    spatial literacy skills in public health</a>.
                    </p>

                  </Grid>

                  <Grid item xs={12} md={4}>

                  <br />                      <br /> 
                  <p>
                  <Button 
                      onClick={() => setVideoModalInner(true)}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        background: colors.orange,
                        fontSize: '18px',
                        marginTop: '1.0em',
                        padding: '0.25em 0.5em',
                      }}
                      >
                      <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Getting Started: Atlas 101
                    </Button>

                    <br />                      <br />
                    
                    <Button 
                      onClick={() => setVideoModalInner(true)}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: colors.white,
                        background: colors.teal,
                        fontSize: '18px',
                        margin: 0,
                        padding: '0.25em 0.5em',
                      }}
                      >
                      <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Explore Trends Over Time
                    </Button>

                    <br />                      <br />
                    
                    <Button 
                      onClick={() => setVideoModalInner(true)}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: colors.white,
                        background: colors.teal,
                        fontSize: '18px',
                        margin: 0,
                        padding: '0.25em 0.5em',
                      }}
                      >
                      <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Link Community Context
                    </Button>
                  </p>

                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                  <Icon symbol={'health'}/>
                  <h5>Health</h5>

                    </RoleIcon>
                    </Features2>
                  </Grid>


                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                      <Icon  symbol={'policy'} />
                      <h5>Policy</h5>
                  
                    </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                       <Icon symbol={'advocacy'} />
                       <h5>Advocacy</h5>

                  </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                  <Features2>
                  <RoleIcon>

                  <Icon symbol={'research'} />
                  <h5>Research</h5>

                    </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                  <Icon symbol={'media'} />
                  <h5>Media</h5>

                  </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>

                  </Grid>


              </Grid>

              <Gutter h={40} />
              <hr></hr>

              <Grid container spacing={5}>
                  <Grid item xs={12} md={8}>

                    <h1>Listen</h1>

                      <br />                      <br />

                    <p>
                    Explore tutorials, video demos, examples of how the Atlas is used in different fields, 
                    and more with Learn toolkit. 
                    </p>


                    <Button 
                      onClick={() => setVideoModalInner(true)}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        background: colors.orange,
                        fontSize: '18px',
                        margin: 0,
                        padding: '0.25em 0.5em',
                      }}
                      >
                      <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Explore the Story Archive
                    </Button>

                  <Button 
                      onClick={() => setVideoModalInner(true)}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: colors.white,
                        background: colors.teal,
                        fontSize: '18px',
                        margin: '2em',
                        padding: '0.25em 0.5em',
                      }}
                      >
                      <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Click Stories on in Map
                    </Button>

                  </Grid>

                  <Grid item xs={12} md={4}>

                  <p>
                  <img
                      src={`${process.env.PUBLIC_URL}/img/story.png`}
                      alt="Story"
                      loading="lazy"
                    />
                  </p>

                  </Grid>

  




              </Grid>

              <Gutter h={40} />
              <hr></hr>

              <Grid container spacing={5}>
                  <Grid item xs={12} md={8}>

                    <h1>Research</h1>
                    <br /><br />
                    <p>
                      Use spatial statistics to detect hot spots with raw case
                      data or by adjusting for population. Because of the
                      infectious nature of COVID, high numbers of cases anywhere
                      will be of concern. At the same time, identifying areas that
                      have a disporotionately high number of cases within the
                      population is necessary to locate areas hit hardest by the
                      pandemic.
                    </p>

                  </Grid>

                  <Grid item xs={12} md={4}>

                  <br />                      <br /> 

                  <p>
                      <img
                          src={`${process.env.PUBLIC_URL}/img/fast-company.webp`}
                          alt="Story"
                          loading="lazy"
                        />
                      </p>
                      <br />
                        The U.S. Covid Atlas earned top distinction in Dynamic <a href="">Health Geography</a> Visualizations
                        in 2021, and also received an honorable mention for innovative design by <i>Fast Company</i>.



                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                      <Icon symbol={'datad'}/>
                      <h5>Data</h5>

                    </RoleIcon>
                    </Features2>
                  </Grid>


                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                      <Icon  symbol={'intelligence'} />
                      <h5>Tech</h5>
                  
                    </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                       <Icon symbol={'innovation'} />
                       <h5>Insights</h5>

                  </RoleIcon>
                    </Features2>
                  </Grid>

                  <Grid item xs={12/5} md={7/5}>
                    <Features2>
                    <RoleIcon>

                      <Icon  symbol={'ai'} />
                      <h5>Blog</h5>
                  
                    </RoleIcon>
                    </Features2>
                  </Grid>

              </Grid>


              <Gutter h={80} />

            </UseCases>
          </UseCasesContainer>

        </HomePageContent>
        <Footer signUp={false} />
        <ExploreButton to="/map" id="floating-cta" active={ctaActive}>
          Explore the Atlas
        </ExploreButton>
        

        <VideoModal
          open={videoModalInner}
          onClose={() => setVideoModalInner(false)}
          title="Intro: US Covid Atlas and Atlas Stories"
          videoUrl="https://www.youtube.com/embed/pjswdUvwbFE"
        />
      </HomePage>
    </>
  );
}

export default Home;
