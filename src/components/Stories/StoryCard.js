import React from 'react';
import styled from 'styled-components';
import { Button, Grid } from '@mui/material';
import colors from '../../config/colors';
import Icon from '../../components/Interface/Icon';

const RowTitle = styled.p`
  font-size: 1rem !important;
`;
const RowBody = styled.p`
  font-size: 0.75rem !important;
`;

const IconContainer = styled.div`
  max-width: 2rem;
  min-width:1rem;
  height:100%;
`;

export const StoryCard = ({ story, setActiveStory }) => {
  const { theme, county, tags, type, title } = story;

  const entryTitle = title?.length ? title : `A ${type} story`;
  return (
    <Grid container sx={{ width: "100%", m: 1, mb: 2 }}>
      <Grid item sm={3} md={1} sx={{ px: 2 }} alignItems="center">
        <IconContainer>
          <Icon symbol={type} style={{ maxwidth: "1rem" }} />
        </IconContainer>
      </Grid>
      <Grid item sm={9} md={3}>
        <RowTitle>{entryTitle}</RowTitle>
        <RowBody>in {county}</RowBody>
      </Grid>
      <Grid item sm={4} md={3}>
        <RowTitle>Theme</RowTitle>
        <RowBody>{theme}</RowBody>
      </Grid>
      <Grid item sm={4} md={3}>
        <RowTitle>Tags</RowTitle>
        <RowBody>{tags.map((t) => `#${t}`).join(", ")}</RowBody>
      </Grid>
      <Grid item sm={4} md={2}>
        <Button
          onClick={() => setActiveStory(story)}
          variant="contained"
          sx={{ color: colors.darkgray, textTransform: "none" }}
        >
          View
        </Button>
      </Grid>
    </Grid>
  );
};
