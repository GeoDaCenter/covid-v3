import React from 'react';
import styled from 'styled-components';
import { useStoriesContext } from '../../contexts/StoriesContext';
import colors from '../../config/colors';
import { StoryContainer } from '../../components/Stories/StoryContainer';

const StoryViewerPanel = styled.div`
    height:fit-content;
    min-width:500px;
    max-width: 30vw;
    min-height: 50vh;
    max-height: fit-content;
    flex: 1;
    overflow-y:auto;
    overflow-x:hidden;
    background:${colors.gray};
    box-sizing:border-box;
`

export const StoryViewerPane = () => {
    const {
        relatedStories,
        selectedStory,
        setSelectedStory
    } = useStoriesContext()
    return (
        <StoryViewerPanel>
            {!!selectedStory?.id ? (<StoryContainer
                story={selectedStory}
                relatedStories={relatedStories}
                relatedStoriesCallback={(story) => setSelectedStory(story)}
            />) : (
                <h2 style={{color:'white', margin: '1em'}}>Open the <i>Stories</i> overlay and select a story to get started.</h2>
            )}
        </StoryViewerPanel>
    )

}
