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
        <h3>Our Stack</h3>
        <br />
        <p>
          The US Covid Atlas is made from a few different components:
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
        <br />
        <h3>Open Source</h3>
        <br />
        <p>
          The Github for our project is public and available at{' '}
          <a
            href="https://github.com/GeoDaCenter/covid-v3"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/GeoDaCenter/covid-v3
          </a>.{' '}
          Contributions are welcome. Volunteers are encouraged to start on the
          “Issues” page and identify “good first issues” to maximize help
          efforts. A public release of the application will continue to be
          updated with new data and features on a regular basis.
        </p>
      </ContentContainer>
      <Footer />
    </TechPage>
  );
};

export default Methodology;
