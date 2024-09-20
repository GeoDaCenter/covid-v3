import React, { useState } from "react";
import styled from "styled-components";
import {
    NavBar,
    Geocoder,
    HeroMap,
    Footer,
    Icon,
    FastTrackInsights,
    Gutter,
    ContentContainer,
  } from "../../components";import { NavLink } from "react-router-dom";
import { Grid, Box, Typography, Button, Modal } from "@mui/material";
import { ArchiveSidebar } from "../Stories/ArchiveSidebar";
import { useStories } from "../../hooks/useStories";
import { StoryContainer } from "../Stories/StoryContainer";
import { ArchiveBody } from "../Stories/ArchiveBody";
import colors from "../../config/colors";


const StoriesPage = styled.div`
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
  ul{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-left: 2.0rem;
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

const VideoContainer = styled(Grid)`
    P {
        margin-bottom: 1.5rem;
    }
    iframe {
        height: 18rem;
        border-radius: 8px;
    }
`

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    boxShadow: 24,
    maxHeight: "95vh",
    overflowY: "auto",
};

const ArchiveModal = ({ open, onClose, story }) => {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={modalStyle}>
                <StoryContainer story={story} />
            </Box>
        </Modal>
    );
};

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


export default function Stories() {
    const [filters, setFilters] = useState([]);
    const [activeStory, setActiveStory] = useState({});
    const {
        stories,
        counts,
        // relatedStories
    } = useStories({
        filters,
    });

    return (
        <StoriesPage>
            <NavBar light />
            <Hero>
            <Gutter h={20} />
            <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
                <h1>
                  <i> Stories</i> from <br />
                   the Pandemic
                </h1>

                <Gutter h={20} />


                <p>
                The COVID-19 pandemic highlighted community capacity for resilience, as well as  
                     inequitable impacts on diverse people and places. This project collects 
                     stories behind the statistics and data. We sought perspectives that represent 
                     the diversity of experiences in the United States, in order to build a more 
                     holistic archive of the pandemic.

                </p>
              </Grid>
              <Grid item xs={12} md={6}>

                    <iframe width="90%" height="100%" src="https://www.youtube.com/embed/pjswdUvwbFE" title="Atlas Stories Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

              </Grid>
            

              <Gutter h={20} />


            </Grid>

            <Gutter h={20} />
          </Hero>


          <BreakQuestion>
                        <h3>
                        Stories from <b>Chicago</b>
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
                            Explore tutorials, <a href="https://www.youtube.com/playlist?list=PLi9Z7UD_p9f8xEga76YV3FyLhiyL8twmm">video demos</a>, and
                            examples of how the Atlas is used for different applications with the <a href="https://uscovidatlas.org/learn"><i>Learn</i></a> toolkit. 
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

                        <a href="http://www.uscovidatlas.org/learn/getting-started">
                        <Button 
                            variant="contained"
                            title="Getting Started"
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                color: colors.black, 
                                background: colors.orange,
                                fontSize: '18px',
                                marginTop: '1.0em',
                                padding: '0.25em 0.5em',
                            }}
                            >
                            <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Getting Started: Atlas 101
                            </Button>
                            </a>

                            <br />                      <br />
                            
                            <a href="https://uscovidatlas.org/learn/trends-over-time">
                            <Button 
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
                            </a>

                            <br />                      <br />
                            
                            <a href="https://uscovidatlas.org/learn/community-contexts">
                            <Button 
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
                            </a>
                        </p>

                        </Grid>
                        </Grid>
                            </UseCases>

                    </UseCasesContainer>

                    <BreakQuestion>
                        <h3>
                        Stories from <b>Chicago</b>
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
                            Explore tutorials, <a href="https://www.youtube.com/playlist?list=PLi9Z7UD_p9f8xEga76YV3FyLhiyL8twmm">video demos</a>, and
                            examples of how the Atlas is used for different applications with the <a href="https://uscovidatlas.org/learn"><i>Learn</i></a> toolkit. 
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

                        <a href="http://www.uscovidatlas.org/learn/getting-started">
                        <Button 
                            variant="contained"
                            title="Getting Started"
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                color: colors.black, 
                                background: colors.orange,
                                fontSize: '18px',
                                marginTop: '1.0em',
                                padding: '0.25em 0.5em',
                            }}
                            >
                            <span style={{fontSize:32, lineHeight:0, marginRight: 6}}>&#9656;</span> Getting Started: Atlas 101
                            </Button>
                            </a>

                            <br />                      <br />
                            
                            <a href="https://uscovidatlas.org/learn/trends-over-time">
                            <Button 
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
                            </a>

                            <br />                      <br />
                            
                            <a href="https://uscovidatlas.org/learn/community-contexts">
                            <Button 
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
                            </a>
                        </p>

                        </Grid>
                        </Grid>
                            </UseCases>

                    </UseCasesContainer>


            <Footer />
            <ArchiveModal
                open={!!activeStory.id}
                onClose={() => setActiveStory({})}
                story={activeStory}
            />
        </StoriesPage>
    );
}
