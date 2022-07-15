import React from 'react';
import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import { StoryPlayer } from './StoryPlayer';

const GradientBox = styled.div`
    background: ${({noBg}) => noBg ? 'none' : 'rgb(24,113,119)'};
    background: ${({noBg}) => noBg ? 'none' : 'linear-gradient(180deg, rgba(24,113,119,1) 0%, rgba(102,69,20,1) 100%)'};
    color: white;
    padding: 1em;
    position:relative;
`

const ShareLink = styled.a`
    border: 1px solid white;
    padding:.5em;
    display:inline-block;
    font-size:.75rem;
    color:white;
    text-decoration:none;
`
const HarmLink = styled.a`
    font-size:.75rem;
    color:white;
    text-decoration:none;
`

const ShareButton = styled.a`
    position: absolute;
    top:0;
    right:0;
`

export const StoryContainer = ({
    story,
    noBg=false
}) => {
    if (!story.type) {
        return null
    }

    const {
        theme,
        tags,
        type,
        title,
        county
    } = story;


    const entryTitle = title?.length ? title : `A ${type} story`
    return <GradientBox noBg={noBg}>
        <Typography variant="h3" element="h2" fontFamily="'Playfair Display', serif;">
            {entryTitle}
        </Typography>
        <Typography variant="h6" sx={{ pb: 1 }}>
            in {county}
        </Typography>
        <StoryPlayer story={story} />
        <Grid container sx={{ py: 2 }}>
            <Grid item xs={12} md={6}>
                <Typography>
                    Theme
                </Typography>
                <Typography variant="h6" sx={{ pb: 1 }}>
                    {theme}
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {!!tags?.length && <>
                    <Typography>
                        Tags
                    </Typography>
                    <Typography variant="h6" sx={{ pb: 1 }}>
                        {tags.map(t => `#${t}`).join(', ')}
                    </Typography>
                </>}
            </Grid>
            <Grid item xs={12} sx={{pt: 2, borderTop: '1px solid #ffffff44'}}></Grid>
            <Grid item xs={12} md={6}>
                <ShareLink href="https://stories.uscovidatlas.org/" target="_blank" rel="noopener noreferrer">
                    Want to contribute to Atlas Stories?
                    <br />
                    Share your pandemic experience.
                </ShareLink>
            </Grid>
            <Grid item xs={12} md={6}>
                <HarmLink href={`/contact?category=HarmfulContent&id=${story.id}`} target="_blank" rel="noopener noreferrer">
                    Is this content harmful? Report it here.
                </HarmLink>
            </Grid>
        </Grid>
        <ShareButton a href={`${process.env.PUBLIC_URL}/story/${story.id}`}>Share</ShareButton>
    </GradientBox>
}