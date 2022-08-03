import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoriesContext } from '../../contexts/StoriesContext';
import colors from '../../config/colors';
import { StoryContainer } from '../../components/Stories/StoryContainer';
import { useDispatch } from 'react-redux';
import { setMapParams } from '../../actions';

const StoryViewerPanel = styled.div`
    height:fit-content;
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
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMapParams({overlay: 'stories'}));
        return () => {
            dispatch(setMapParams({overlay: ''}))
        }
    },[]);

    return (
        <StoryViewerPanel>
            {!!selectedStory?.id ? (<StoryContainer
                story={selectedStory}
                relatedStories={relatedStories}
                relatedStoriesCallback={(story) => setSelectedStory(story)}
            />) : (
                <p style={{color:'white', margin: '1em'}}>
                    <b>Stories</b>
                    <br/>
                    Click a story on the map to get started.
                </p>
            )}
        </StoryViewerPanel>
    )

}
