import React from "react";
import { Grid, Typography } from "@mui/material";
import { StoryCard } from "../Stories/StoryCard";

export const ArchiveBody = ({ title, stories, setActiveStory }) => {
    return (
      <Grid item xs={12} md={9}>
        <Grid container spacing={3} sx={{ p: 1 }}>
          {!!title && <Typography variant="h5" sx={{ pb: 3, pt: 1 }}>
            {title}
          </Typography>}
          {stories.map((story, i) => (
            <StoryCard key={i} story={story} setActiveStory={setActiveStory} />
          ))}
        </Grid>
      </Grid>
    );
  };