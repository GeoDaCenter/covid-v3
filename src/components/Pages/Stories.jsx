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

const CenteredGrid = styled(Grid)`
  flex-direction: column;
  display: flex;
  align-self: center;
  
  a {
    text-decoration: none;
  }

  h2 {
    font-family: "Lato", sans-serif;
    font-size: 1.3rem;
  }
  p {
    font-family: "Lato", sans-serif;
    font-size: 1.1rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    text-align: left;
  }
`;

export default function Stories() {
    const [filters, /* setFilters */] = useState([]);
    const [activeStory, setActiveStory] = useState({});
    const {
        // stories,
        // counts,
        // relatedStories
    } = useStories({
        filters,
    });

    // Data model for Stories page
    const showcaseStoryMap = {
        'Chicago': [
            {
                id: 'xrq3Z6QWAiwdteIxPhXr8',
                title: 'I Missed Coming to Work',
                image: '/img/stories/xrq3Z6QWAiwdteIxPhXr8.png',
                description: 'Theirs wasn\'t the easiest to transfer from in-person to at home, because it centers around direct services with youth, aiming to find them opportunities for work and training.',
            },
            {
                id: 'OPZahZe3sdjYGaHVGvPdy',
                title: 'Changes in Healthcare because of COVID',
                image: '/img/stories/OPZahZe3sdjYGaHVGvPdy.png',
                description: 'COVID shined a spotlight on the increased need for public health and epidemiology. It also allowed healthcare workers to look at a patient more holistically, coming with the recognition of the various ways that a virus can affect people.',
            },
            {
                id: 'Bb8oKNRRDRNDdTBaSUt7G',
                title: 'I Survived COVID',
                image: '/img/stories/Bb8oKNRRDRNDdTBaSUt7G.png',
                description: 'A person describes taking COVID seriously from the beginning, with the help of their brother, who is a Doctor of Internal Medicine. Based on previous historical events, they can somewhat understand the reasoning behind some of being skeptical about the COVID vaccine, however, they believe in doctors, science, CDC guidelines, and living in the present.',
            },
            {
                id: 'SPH21NEYIztOdoTppQfPk',
                title: 'Our Lives Changed in the Span of a Week',
                image: '/img/stories/SPH21NEYIztOdoTppQfPk.png',
                description: 'A person details how quickly things changed in the lives of people across the country. From daily routines, to work meetings transitioning online, COVID forced the need to adapt, and highlighted the importance of having daily interactions with people and the bigger picture of life as a whole.',
            },
            {
                id: '034YF6t1Kx-c6UfH8tfKz',
                title: 'Dealing with Loss',
                image: '/img/stories/034YF6t1Kx-c6UfH8tfKz.png',
                description: 'A man recounts the difficult experience of witnessing his mother having a stroke, and the frustration of not being able to be by her side when she passed away, due to the overcrowding and strict visitation rules that were in place at hospitals during the pandemic.',
            },
        ],
        'Champaign-Urbana': [
            {
                id: 'HOFD24QogstIXDgTx_zQQ',
                title: 'Sole Provider',
                image: '/img/stories/HOFD24QogstIXDgTx_zQQ.png',
                description: 'A Polish immigrant and current student details the difficulties of having to remain at home as well as being the only income-earner in her family during the pandemic.',
            },
            {
                id: 'm5WQ_3TtsxKolOKXUu2AW',
                title: 'Taking Precautions',
                image: '/img/stories/m5WQ_3TtsxKolOKXUu2AW.png',
                description: 'A former professor at the University of Illinois received COVID shots and did what they could to stay at home more often. It took a bit of time, but ultimately they knew that being cautious would be the best for staying healthy.',
            },
            {
                id: 'MInqbCMUrlVx5bETDr2ZY',
                title: 'My Little Brother & COVID',
                image: '/img/stories/MInqbCMUrlVx5bETDr2ZY.png',
                description: 'A student from the University of Illinois details her little brother’s experience with COVID and mentions the long term effects that he continues to deal with as a result.',
            },
        ],
        'Mississippi': [
            {
                id: '5CSAg1X0s9Faue2lENpS0',
                title: 'Connections between Academia and the Public',
                image: '/img/stories/5CSAg1X0s9Faue2lENpS0.png',
                description: 'A medical student details the stark differences with how she perceives and understands COVID through the lens of her studies, and how some in her family and others across the country see it as much more trivial and much less urgent than she does. They also talk about changes in their personal life over this time, and how in the future, researchers and scientists can improve in the ways they discuss the impact of diseases to the public.',
            },
            {
                id: 't9YVItD6se7E1hDHgeviZ',
                title: 'COVID, the Church, and Community',
                image: '/img/stories/t9YVItD6se7E1hDHgeviZ.png',
                description: 'A community liaison discusses the importance of utilizing trusted community members to spread the message regarding COVID and access to the vaccine. In the Mississippi Delta area, faith-based organizations play this role well. Although skeptical at first, they understood the importance of bringing awareness and information to the local community, especially the rural community, regarding COVID.',
            },
            {
                id: 'Musl4wVXLVnYgtbGcDwIZ',
                title: 'The Dangers of COVID: From Skepticism to Understanding',
                image: '/img/stories/Musl4wVXLVnYgtbGcDwIZ.png',
                description: 'A cardiopulmonary worker didn\'t understand why so many people were buying disinfectant spray in June 2020. The initial skepticism faded when their co-worker was placed on a ventilator after getting COVID.',
            },
        ],
        'Geography': [
            {
                id: 'nUhQUof8-J9v_VwGw4Qi9',
                title: 'A New Start',
                image: '/img/stories/nUhQUof8-J9v_VwGw4Qi9.png',
                description: 'A geographer and homeschooling parent details the difficulties of libraries being closed, the Canadian border being closed, preventing them from seeing family, and the challenges associated with everyone in the household being in the same space all of the time. They also discuss how they learned from those initial challenges and grew stronger as a family, and how the pandemic led them toward the field of geography.',
            },
            {
                id: 'wmnMqFXDL6YxApz-OHdKR',
                title: 'The Media Massaging the COVID story',
                image: '/img/stories/wmnMqFXDL6YxApz-OHdKR.png',
                description: 'A Geography professor expresses his frustration with reporters attempting to predict the severity of COVID. There are too many factors involved, and the globalization of the world means we must all be diligent in the face of a pandemic. ',
            },
            {
                id: '7xiqYgM4To5YtdqUjHMfb',
                title: 'A House of Friends',
                image: '/img/stories/7xiqYgM4To5YtdqUjHMfb.png',
                description: 'A teacher looks back on having to stay with a handful of friends during the pandemic, many of whom lost their jobs. They mention the difficulties students faced with online learning as well as the eventual return to in-person learning. Their research looked at the reduction of unhoused people and trash in the streets during the height of the pandemic. ',
            },
        ]
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
                Object.keys(showcaseStoryMap).map((keyName, keyIndex) => <div key={`section-${keyName}`}>
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
                                </Grid>
                            </Grid>

                            {showcaseStoryMap[keyName].map((story) =>
                                <Grid container spacing={5} style={{ padding: '1rem'}}>
                                    <Grid item xs={12} md={4}>
                                        <a href={`/story/${story.id}`} target={'_blank'} rel='noreferrer noopener'>
                                            <img src={story.image} alt={''} />
                                        </a>
                                    </Grid>

                                    <CenteredGrid item xs={12} md={8}>
                                        <h2><a href={`/story/${story.id}`} target='_blank' rel='noreferrer noopener'>{story.title}</a></h2>
                                        <p>{story.description}</p>
                                    </CenteredGrid>
                                </Grid>
                            )}
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
