import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoriesContext } from '../../contexts/StoriesContext';
import colors from '../../config/colors';
import { StoryContainer } from '../../components/Stories/StoryContainer';
import { useDispatch } from 'react-redux';
import { setMapParams, setPanelState } from '../../actions';
import { Button } from '@mui/material';

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
    position: relative;
    @media (max-width: 600px) {
        position:fixed;
        bottom:0;
        left:0;
        width:100vw;
        height: 40vh;
        min-height:initial;
        max-width: initial;
        z-index:50000;
        
    }
`

const CloseButton = styled(Button)`
    position:absolute;
    top:2.5em;
    right:-.125em;
    min-height:0;
    color:white;
    /* font-weight:bold; */
    text-transform:none;
    /* font-size:1.5rem; */
`

export const StoryViewerPane = () => {
    const {
        relatedStories,
        selectedStory,
        setSelectedStory
    } = useStoriesContext()
    const dispatch = useDispatch();
    const handleClose = () => {
        // dispatch(setPanelState({storiesPane: false}))
        setSelectedStory({})
    }

    useEffect(() => {
        dispatch(setMapParams({ overlay: 'stories' }));
        return () => {
            dispatch(setMapParams({ overlay: '' }))
        }
    }, []);

    return (
        <StoryViewerPanel id="story-viewer-panel">
            {!!selectedStory?.id ? (<>
                <StoryContainer
                    story={selectedStory}
                    relatedStories={relatedStories}
                    relatedStoriesCallback={(story) => setSelectedStory(story)}
                />
                <CloseButton
                    variant="text"
                    onClick={handleClose}
                >
                    Close
                </CloseButton>
            </>) : (
                <p style={{ color: 'white', margin: '1em' }}>
                    <b>Stories</b>
                    <br />
                    Click a story on the map to get started.
                </p>
            )}
        </StoryViewerPanel>
    )

}
