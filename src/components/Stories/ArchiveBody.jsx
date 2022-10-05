import React from 'react'
import { Grid, Typography } from '@mui/material'
import { StoryCard } from './StoryCard'

/**
 * Renderer for the body of a stories archive
 *
 * @category Components/Stories
 * @param {Object} props
 * @param {StoryMeta[]} props.stories List of story metadata
 * @param {string} props.title Title of the archive
 * @param {function} props.setActiveStory Set current selected story
 * @component
 */
function ArchiveBody({ title, stories, setActiveStory }) {
    return (
        <Grid item xs={12} md={9}>
            <Grid container spacing={3} sx={{ p: 1 }}>
                {!!title && (
                    <Typography variant="h5" sx={{ pb: 3, pt: 1 }}>
                        {title}
                    </Typography>
                )}
                {stories.map((story, i) => (
                    <StoryCard
                        key={i}
                        story={story}
                        setActiveStory={setActiveStory}
                    />
                ))}
            </Grid>
        </Grid>
    )
}

export { ArchiveBody }
