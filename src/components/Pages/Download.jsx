import React from 'react';
import styled from 'styled-components';
import { NavBar, Footer, CsvDownloader, ContentContainer, Gutter } from '../../components';

const DownloadPage = styled.div`
  background: white;
`;

export default function Downloader() {
  return (
    <DownloadPage>
      <NavBar light />
      <ContentContainer>
        <h1>Data Download</h1>
        <Gutter h={10} />
        <p>
          Use the form below to download the most recent data available.
          Documentation describing the data will be included in the ZIP archive.
        </p>
        <Gutter h={10} />
        <h2>CITATION</h2>
        <hr />
        <p>
          <code>
          Marynia Kolak, Qinyun Lin, Dylan Halpern, Susan Paykin, Aresha Martinez-Cardoso, and Xun Li. The US Covid Atlas, 2022. Center for Spatial Data Science at University of Chicago. https://www.uscovidatlas.org.
          </code>
          <br />
          <br />
          For a list of all contributors to the Atlas, please visit our{' '}
          <a href="/about#team">about</a> page.
        </p>
        <Gutter h={10} />
        <CsvDownloader />
      </ContentContainer>
      <Footer />
    </DownloadPage>
  );
}
