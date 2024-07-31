import React from 'react';
import styled from 'styled-components';
import { ContentContainer, Gutter, NavBar, Footer } from '../../components';

const TechPage = styled.div`
  background: white;
  img#workflow,
  img.hotspot {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    display: block;
  }
  img.jenks {
    display: block;
  }
  img.hotspot {
    margin-bottom: 0;
  }

  p.caption {
    text-align: center;
    opacity: 0.7;
    margin-top: 0;
  }
`;

const Methodology = () => {
  return (
    <TechPage>
      <NavBar light />
      <ContentContainer>
        <h1>Tech</h1>
        <hr />
        <h3>Overall Architecture</h3>
        <br />
        <p>
          The US Covid Atlas is a static web application built with React and deployed via Netlify. Through the course of the project, GitHub actions were used to run Python scraping scripts that fetched, processed, and recombined Covid-related data from <a href="/docs">many different sources</a>. This data was then zipped and pushed to AWS S3 and Google BigQuery. The build process for the site downloads and unzips these files, making them available for access by the frontend map and other visualization tools. A Google Sheet, which is also ingested at build time, provides a user-friendly configuration format that holds variable names, map symbology information, and more.
        </p>
        <Gutter h={40} />
        <h3>Internal JS API</h3>
        <br />
        <p>
          To learn much more about the inner-workings of the React application, view our JsDocs here at <a href="https://docs.uscovidatlas.org">docs.uscovidatlas.org</a>.
        </p>
        <Gutter h={40} />
        <h3>Geospatial Analysis and Visualization</h3>
        <br />
        <p>
          The interactive map and charts in the US Covid Atlas are made from a few different components:
          <ul>
            <li>
              <strong><a href="https://xunli.gitbook.io/jsgeoda">jsGeoDa</a></strong> &mdash; a JavaScript library that performs advanced spatial analysis operations directly in your web browser. jsGeoDa is built from a <a href="https://developer.mozilla.org/en-US/docs/WebAssembly">WebAssembly</a> port of <a href="https://geodacenter.github.io/">GeoDa</a>, an open source spatial analysis software developed and maintained by the GeoDaCenter at University of Chicago. For this application, jsGeoDa has been <a href="https://github.com/GeoDaCenter/jsgeoda/tree/worker-compatible">modified slightly</a>.
            </li>
            <li>
              <strong><a href="https://deck.gl/">deck.gl</a></strong> &mdash; a web mapping JavaScript library to create the interactive web map interface.
            </li>
            <li>
              <strong><a href="https://d3js.org/">d3.js</a></strong> &mdash; for charts and data visualization.
            </li>
            <li>
              <strong><a href="https://mapbox.com">Mapbox</a></strong> &mdash; for basemap and vector tile hosting. 
            </li>
          </ul>
        </p>
        <Gutter h={40} />
        <h3>Covid Histories</h3>
        <br />
        <p>
          Video collection for the Atlas Stories project was set up and managed via a serverless architecture that utilizes AWS Lambda, S3, and CloudFront services. During the open submission period, user video or audio contributions were collected via webcam, and stored in S3 during an admin review period. After review, they were transcoded using FFMPEG through a scheduled GitHub action, and copied within the S3 bucket to a publicly accessible folder behind a CDN. Later, we began collecting long-form interviews which we transcoded locally and uploaded directly to S3 for publication.
        </p>
        <Gutter h={40} />
        <h3>Open Source</h3>
        <br />
        <p>
          The Github repository for the current release of the US Covid Atlas is public and available at{' '}
          <a
            href="https://github.com/GeoDaCenter/covid-v3"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/GeoDaCenter/covid-v3
          </a>.{' '} The full archive of our historical Covid datasets is in the git history of our archive repo{' '}
          <a
            href="https://github.com/GeoDaCenter/covid"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/GeoDaCenter/covid
          </a>.
        </p><br /><br />
      </ContentContainer>
      <Footer />
    </TechPage>
  );
};

export default Methodology;
