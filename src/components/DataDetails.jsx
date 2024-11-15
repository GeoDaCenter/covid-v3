import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import gfm from 'remark-gfm';

import ReactMarkdown from 'react-markdown';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import colors from '../config/colors';

const Container = styled.div`
  h3 {
    margin: 20px 0 5px 0;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
  }
  p {
    margin-bottom: 5px;
  }
  table {
    width: 100%;
    margin: 0 0 20px 0;
    padding: 0;

    thead tr th:nth-of-type(1),
    tbody tr td:nth-of-type(1),
    thead tr th:nth-of-type(2),
    tbody tr td:nth-of-type(2) {
      width: 25%;
    }
    thead tr th:nth-of-type(3),
    tbody tr td:nth-of-type(3) {
      width: 50%;
    }
    // th,td {
    //     border:1px solid black;
    // }
    thead tr {
      background: ${colors.lightblue}88;
    }
    tbody tr:nth-of-type(even) {
      background: ${colors.lightgray}55;
    }
  }
`;

const Accordion = styled(MuiAccordion)``;

const AccordionSummary = styled(MuiAccordionSummary)``;

const AccordionDetails = styled(MuiAccordionDetails)`
  ul {
    color: black;
  }
   table {
    color: black;
    font-size: 1.1em;
  }
  th {
    padding: 4px;
  }
`;

const AccordionHeader = styled(Typography)`
  span.tag {
    padding: 4px 8px;
    margin: 5px;
    border-radius: 12px;
    font-size: 65%;
    background: ${colors.lightgray};
    text-transform: uppercase;
    font-weight: bold;
  }
`;

const dataList = [
  {
    header: 'USA Facts',
    tags: ['Cases', 'Deaths', 'County', 'State'],
    content:
      '/data-docs/usafacts.md',
  },
  {
    header: 'New York Times',
    tags: ['Cases', 'Deaths', 'County', 'State'],
    content:
      '/data-docs/new-york-times.md',
  },
  {
    header: '1 Point 3 Acres',
    tags: ['Cases', 'Deaths', 'County', 'State'],
    content:
      '/data-docs/_1p3a.md',
  },
  {
    header: 'Center for Disease Control',
    tags: ['Testing', 'Vaccination', 'County'],
    content:
      '/data-docs/center-for-disease-control.md',
  },
  {
    header: 'Health and Human Services',
    tags: ['Testing', 'State'],
    content:
      '/data-docs/health-and-human-services.md',
  },
  {
    header: 'County Health Rankings and Roadmaps',
    tags: ['Context'],
    content:
      '/data-docs/county-health-rankings.md',
  },
  {
    header: 'Yu Group at UC Berkeley',
    tags: ['Forecasting'],
    content:
      '/data-docs/yu-group.md',
  },
  {
    header: 'Safegraph Social Distancing',
    tags: ['Mobility'],
    content:
      '/data-docs/safegraph_sd.md',
  },
  {
    header: 'American Community Survey',
    tags: ['Context', 'Essential Workers', 'Population'],
    content:
      '/data-docs/american-community-survey.md',
  },
  {
    header: 'Hospitals and Clinics',
    tags: ['Context', 'Point Data'],
    content:
      '/data-docs/hospitals-and-clinics.md',
  },
  {
    header: 'Geographies',
    tags: ['Boundaries', 'Geometry', 'County', 'State'],
    content:
      '/data-docs/geographies.md',
  },
];

/**
 * Data documentation and details accordion 
 * 
 * @component
 * @category Components/Layout 
 */
function DataDetails(){
  const [expanded, setExpanded] = useState('');
  const [dataDescriptions, setDataDescriptions] = useState([]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  async function getMarkdownFiles(dataList) {
    const markdownFilePromises = await dataList.map((data) =>
      fetch(data.content).then((r) => r.text()),
    );
    Promise.all(markdownFilePromises).then((markdownFiles) => {
      setDataDescriptions(markdownFiles);
    });
  }

  useEffect(() => {
    getMarkdownFiles(dataList);
  }, []);

  return (
    <Container>
      {dataList.map((dataset, index) => (
        <Accordion
          square
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            aria-controls={`panel${index}d-content`}
            id={`panel${index}d-header`}
          >
            <AccordionHeader>
              {dataset.header}
              {dataset.tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </AccordionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <ReactMarkdown remarkPlugins={[gfm]}>
                {dataDescriptions[index]}
              </ReactMarkdown>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default DataDetails;
