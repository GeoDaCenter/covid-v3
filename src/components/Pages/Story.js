import React from "react";
import styled from "styled-components";
import { ContentContainer, NavBar, Footer } from "../../components";
import { useStories } from "../../hooks/useStories";
import { ArchiveBody } from "../Stories/ArchiveBody";
import {StoryContainer} from '../Stories/StoryContainer';

const StoryPage = styled.div`
  background: white;
  ul li {
    margin-bottom: 16px;
  }
`;

const Story = ({ history, location, match }) => {
  const {
    params: { storyId },
  } = match;

  const {
    activeStory,
    relatedStories
  } = useStories({
    singleStoryId: storyId
  })
  
  return (
    <StoryPage>
      <NavBar light />
      <ContentContainer>
        <StoryContainer story={activeStory} noBg />
        <hr />
        <h2>Here are some related stories:</h2>
        <ArchiveBody stories={relatedStories} setActiveStory={({id}) => {
          // history.push(`${process.env.PUBLIC_URL}/story/${id}`)
          window.location.href = `${process.env.PUBLIC_URL}/story/${id}`
        }}/>
      </ContentContainer>
      <Footer />
    </StoryPage>
  );
};

export default Story;
