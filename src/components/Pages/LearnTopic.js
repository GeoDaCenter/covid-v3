import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
// import { NavLink } from 'react-router-dom';

// import Grid from '@mui/material/Grid';
// import MuiAccordion from '@mui/material/Accordion';
// import MuiAccordionSummary from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';

import { NavBar, Footer, ContentContainer } from '../../components';
import colors from '../../config/colors';
import MdxPages from '../Learn/MdxPages';

const LearnPage = styled.div`
  background: white;
  ol {
    list-style: none;
    counter-reset: item;
    margin:.5rem 0 .5rem .5rem;
  }

  ol li {
    position: relative;
    counter-increment: item;
    padding:0 0 1rem .5rem;
  }
  
  ol li:before {
    position: absolute;
    content: counter(item);
    width: 1.75rem;
    height: 1.75rem;
    left:-1.75rem;
    top:0;
    background: ${colors.teal};
    color:white;
    text-align: center;
    border-radius:50%;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
    transform:translateY(25%);
  }

  table, th, td {
    border: 1px solid;
    border-collapse: collapse;
  }
  th, td {
    padding:.25em .5em;
  }
  p {
    margin-bottom: 1rem;
  }
  .cls-1 {
    stroke: black;
    stroke-width: 6px;
    fill:none;
  }
  img {
    max-width:100%;
  }
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
  const config = MdxPages[topic]?.config;
  
  const {
    description,
    title,
    slug,
  } = config || {};

  return (
    <LearnPage>
      <Helmet>
        <title>{title || 'US Covid Atlas :: Learn'}</title>
        <meta name="description" content={description || "Learn about the US Covid Atlas"} />
        <link rel="canonincal" href={`https://uscovidatlas.com/learn/${slug}`} />
      </Helmet>
      <NavBar light />
      <ContentContainer>
        {Content ? <Content /> : 'No content found. Sorry!'}
      </ContentContainer>
      <Footer />
    </LearnPage>
  );
}
