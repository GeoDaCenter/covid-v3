import React from 'react';
import styled from 'styled-components';
// import { NavLink } from 'react-router-dom';

// import Grid from '@mui/material/Grid';
// import MuiAccordion from '@mui/material/Accordion';
// import MuiAccordionSummary from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';

import { NavBar, Footer, ContentContainer } from '../../components';
import MdxPages from '../Learn/MdxPages';

const LearnPage = styled.div`
  background: white;
`;

export default function Learn({
    history, 
    location, 
    match
}) {  
  const {
    params: { topic },
  } = match;
  const Content = MdxPages[topic]?.default;
  return (
    <LearnPage>
      <NavBar light />
      <ContentContainer>
        {Content ? <Content /> : 'No content found. Sorry!'}
      </ContentContainer>
      <Footer />
    </LearnPage>
  );
}
