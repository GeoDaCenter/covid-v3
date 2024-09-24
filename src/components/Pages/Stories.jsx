import React, {useState} from "react";
import styled from "styled-components";
import {
    NavBar,
    Footer,
    Gutter,
} from "../../components";
import {Grid, Box, Modal, SvgIcon} from "@mui/material";
import {useStories} from "../../hooks/useStories";
import {StoryContainer} from "../Stories/StoryContainer";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
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

  ul {
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

const ArchiveModal = ({open, onClose, story}) => {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={modalStyle}>
                <StoryContainer story={story}/>
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
  //padding-top: 40px;
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

// Default styling for body>hr is a dark gray background
const WhiteBody = styled.div`
  background: #ffffff !important;
  padding: 1em 0;
  margin: 0 auto;
`;

const Divider = () => {
    return (<WhiteBody>
        <hr/>
    </WhiteBody>)
}

const SectionHeader = styled.h1`
  max-width: 30vw !important;
  word-break: break-word;
  padding-bottom: 2rem;
`;

const VideoText = styled.h5`
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
  margin-top: 2rem;
`;

const VideoIcon = styled(SvgIcon)`
  justify-content: center;
  width: 4rem;
  height: 4rem;
  display: block;
  svg {
    fill: ${colors.lightslategrey};
    stroke: ${colors.lightslategrey};
  }
`;

const VideoLink = ({url}) => <a href={url} target='_blank' rel='noreferrer noopener'>
    <VideoText><VideoIcon component={OndemandVideoIcon} inheritViewBox /></VideoText>
</a>;

export default function Stories() {
    const [filters, /* setFilters */] = useState([]);
    const [activeStory, setActiveStory] = useState({});
    const {
        stories,
        // counts,
        // relatedStories
    } = useStories({
        filters,
    });

    // TODO: Placeholders for actual page content
    const placeholderImage = '/icons/county-level-data@2x.png';
    const placeholderDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
        'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
        'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
        'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ' +
        'mollit anim id est laborum.';

    // TODO: Data model for Stories page
    const showcaseStories= {
        'Chicago': {
            image: placeholderImage,
            description: placeholderDescription,
            storyIds: [
                'xrq3Z6QWAiwdteIxPhXr8',
                'OPZahZe3sdjYGaHVGvPdy',
                'Bb8oKNRRDRNDdTBaSUt7G',
                'SPH21NEYIztOdoTppQfPk',
                '034YF6t1Kx-c6UfH8tfKz',
            ]
        },
        'Champaign-Urbana': {
            image: placeholderImage,
            description: placeholderDescription,
            storyIds: [
                'HOFD24QogstIXDgTx_zQQ',
                'm5WQ_3TtsxKolOKXUu2AW',
            ]
        },
        'Mississippi': {
            image: placeholderImage,
            description: placeholderDescription,
            storyIds: [
                '5CSAg1X0s9Faue2lENpS0',
            ]
        },
        'Geography': {
            image: placeholderImage,
            description: placeholderDescription,
            storyIds: [
                'nUhQUof8-J9v_VwGw4Qi9',
                'teiUr_zD9bW-zHid5hGoV',
            ]
        }
    }

    return (
        <StoriesPage>
            <NavBar light/>
            <Hero>
                <Gutter h={20}/>
                <Grid container spacing={2}>

                    <Grid item xs={12} md={6}>
                        <h1>
                            <i> Stories</i> from <br/>
                            the Pandemic
                        </h1>

                        <Gutter h={20}/>


                        <p>
                            The COVID-19 pandemic highlighted community capacity for resilience, as well as
                            inequitable impacts on diverse people and places. This project collects
                            stories behind the statistics and data. We sought perspectives that represent
                            the diversity of experiences in the United States, in order to build a more
                            holistic archive of the pandemic.

                        </p>
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <iframe width="90%" height="100%" src="https://www.youtube.com/embed/pjswdUvwbFE"
                                title="Atlas Stories Overview" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

                    </Grid>


                    <Gutter h={20}/>


                </Grid>

                <Gutter h={20}/>
            </Hero>


            <BreakQuestion>
                <h3>
                Stories by <b>Area</b>
                </h3>
                <Arrow />
            </BreakQuestion>

            {
                Object.keys(showcaseStories).map((keyName, keyIndex) => <div key={`section-${keyName}`}>
                    {keyIndex > 0 && <Divider></Divider>}

                    <UseCasesContainer>
                        <UseCases>
                            <Grid container spacing={5}>
                                <Grid item xs={12} md={8}>
                                    <SectionHeader>
                                        {
                                            keyName !== 'Geography'
                                                ? <>Stories from {keyName}</>
                                                : <>Other Stories</>
                                        }
                                    </SectionHeader>

                                    <p>{showcaseStories[keyName]?.description}</p>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <img src={showcaseStories[keyName]?.image} alt={''} />
                                </Grid>
                            </Grid>


                            <Grid container spacing={5}>
                                {
                                    showcaseStories[keyName]?.storyIds?.map((id, index) => {
                                        const story = stories?.find(s => s.id === id);
                                        return (<Grid key={`videoLink-${keyName}-${index}`} item xs={3} md={1}>
                                            <VideoLink url={`/story/${id}`}></VideoLink>
                                            <small>{story?.title || 'A video story'}</small>
                                        </Grid>);
                                    })
                                }
                            </Grid>
                        </UseCases>

                    </UseCasesContainer>
                </div>)
            }

            <Footer/>
            <ArchiveModal
                open={!!activeStory.id}
                onClose={() => setActiveStory({})}
                story={activeStory}
            />
        </StoriesPage>
    );
}
