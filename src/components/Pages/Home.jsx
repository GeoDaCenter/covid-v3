import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import Grid from "@mui/material/Grid";

import {
  NavBar,
  Geocoder,
  HeroMap,
  Footer,
  FastTrackInsights,
  Gutter,
} from "../../components";
import { MAPBOX_ACCESS_TOKEN } from "../../config";
import colors from "../../config/colors";
import { Button, Modal } from "@mui/material";
import { VideoModal } from "../Interface/VideoModal";

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

        </HomePageContent>
        <Footer signUp={false} />
        <ExploreButton to="/map" id="floating-cta" active={ctaActive}>
          Explore the Atlas
        </ExploreButton>
        <Modal open={storiesModal} onClose={() => setStoriesModal(false)}>
          <ModalContent>
            <ModalContentInner>
              <h3>Atlas Stories is live!</h3>
              <Gutter h={20} />
              {/* <Button 
                onClick={() => setVideoModalInner(true)}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  background: colors.yellow,
                  fontSize: '24px',
                  margin: 0,
                  padding: '0.25em 0.5em' 
                }}
                >
                <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Share Your Pandemic Experience
              </Button>
              <Gutter h={20} /> */}
              <p>
                Atlas Stories by the US Covid Atlas collects stories behind the
                statistics and data. We seek perspectives that represent the
                diversity of experiences in the United States, in order to build
                a more holistic archive of the pandemic.
              </p>
              <Gutter h={20} />
              <div style={{display:'flex'}}>
              <Button 
                onClick={() => setVideoModalInner(true)}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  background: colors.orange,
                  fontSize: '24px',
                  margin: 0,
                  padding: '0.25em 0.5em',
                }}
                >
                <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Learn more
              </Button>
              <Button 
                onClick={() => window.location.href = "https://stories.uscovidatlas.org/"}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  background: colors.yellow,
                  fontSize: '24px',
                  margin: 0,
                  padding: '0.25em 0.5em',
                }}
                >
                  Submit a Story
              </Button>
              </div>
              {/* <Gutter h={20} />
              <p>
                <a href="https://stories.uscovidatlas.org/">
                  Share Your Pandemic Experience
                </a>
              </p>
              <Gutter h={20} />
              <p>
                See the{" "}
                <a href="/map?lat=38.454&lon=-92.534&z=4.4&src=county_nyt&var=Confirmed_Count_per_100K_Population&mthd=natural_breaks&date=922&range=7&ovr=stories&viz=2D&v=2">
                  Stories Map
                </a>{" "}
                or <a href="/archive">Interactive Archive</a>.
              </p> */}
              <CloseButton onClick={() => setStoriesModal(false)}>
                &times;
              </CloseButton>
            </ModalContentInner>
          </ModalContent>
        </Modal>
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
