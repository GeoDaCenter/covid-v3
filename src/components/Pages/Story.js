import React from "react";
import styled from "styled-components";
import { ContentContainer, NavBar, Footer } from "../../components";
import { useStories } from "../../hooks/useStories";
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
  const handleRelatedStory = ({id}) => {
    // history.push(`${process.env.PUBLIC_URL}/story/${id}`)
    window.location.href = `${process.env.PUBLIC_URL}/story/${id}`
  }

  return (
    <StoryPage>
      <NavBar light />
      <ContentContainer>
        <StoryContainer 
          story={activeStory} 
          noBg 
          relatedStories={relatedStories} 
          relatedStoriesCallback={handleRelatedStory}
          />
      </ContentContainer>
      <Footer />
    </StoryPage>
  );
};

export default Story;
