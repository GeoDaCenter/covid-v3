import React from 'react';
import styled from 'styled-components';
import { ContentContainer, Gutter, NavBar, Footer } from '../../components';
// import colors from '../../config/colors';

const MethodsPage = styled.div`
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
    <MethodsPage>
      <NavBar light />
      <ContentContainer>
        <h1>Methodology</h1>
        <hr />
        <p> 
          The Atlas incorporates multiple visual analytic methods to explore data across space and time, 
          as well as spatial statistical products to measure spatial clusters and outliers. This section highlights analytic methods used on the US Covid Atlas Dashboard,
          tying content posted in early days of the Pandemic, as well as from our work published
          in <a href="https://onlinelibrary.wiley.com/doi/10.1111/tgis.12786"><i>Transacations of GIS</i></a>.
        </p>
        <br />
        <p> 
          For a more complete view of the data, methods, and technological framework developed for the Atlas,
          be sure to read through the <a href="https://uscovidatlas.org/learn">Learn Toolkit</a>,<a href="https://uscovidatlas.org/data"> Data</a>, 
          <a href="https://uscovidatlas.org/insights#research"> Research</a>, and <a href="">Tech</a> pages on this site.
        </p>

        <Gutter h={30} />
        
        <h3>Spatial Scale</h3>
        <br />
        <p>
          When the Pandemic first emerged in early 2020, county-level visualizations were rare 
          but when viewed, show a dramatically more nuanced and detailed pandemic landscape. The  US Covid Atlas was the   
          <a href="https://news.uchicago.edu/story/state-level-data-misses-growing-coronavirus-hot-spots-us-including-south#"> first dashboard</a> to visualize data at both state and county-scale as total cases, deaths,
          and population-weighted rates to provide a richer understanding of the
          pandemic. Case information can be explored by clicking on county or
          state areas to generate pop-up windows, or to change graphs of
          confirmed cases.
        </p>
        <img
          id="workflow"
          src={`${process.env.PUBLIC_URL}/img/workflow_fig1.png`}
          alt="Interactive Workflow"
        />
        <p className="caption">
          Figure displays the options available at the current state of the
          project and the steps required to display each map available in an earlier version of the Atlas. Today,
          there are additional options for viewing including both 2D and 3D styles of mapping.
        </p>
        
        <Gutter h={30} />
        
        <h3>Time Scale</h3>
        <br />
        <p>
          The thematic maps on the Atlas are interactive and quickly provide access to multiple sources of COVID-19 
          data over time for historical exploration using a time slider tool. A temporal slider allows the current 
          view to be updated over time, providing users the ability to watch the pandemic emerge over time.
        </p>
        <br />
        <p> In addition, you'll find data available at different time scales, including:       
          <li><b>Cumulative:</b> Total number of instances, such as confirmed cases, deaths, or vaccines, since the start of the pandemic or the start of data collected.</li>
          <li><b>Daily New:</b> The number of new instances per day for which data is available.</li>
          <li><b>7-Day Average:</b> The average number of instances over the previous 7-day period for which data is available.</li>
          <li><b>Custom Range:</b> Use the Time Slider and Calendar to choose a custom date range; i.e. the last month, 6 months, the latest variant, etc.</li>
        </p>  
        <br />
        <p>        For example, applying the natural breaks with fixed bins on accumulative confirmed COVID-19 cases displays how the disease has spread over time since the very beginning: from just a few counties in March 2020 to almost the entire country by June. Alternatively, visualizing the temporal change based on the daily new confirmed cases (or 7-day average) helps detect areas with emerging cases. Interactive, explorative temporal detection like this allows us to capture not only the base rate, but also the changes that are both critical to tracking areas of concern.
        </p>
        <Gutter h={30} />
        
        <h3>Dynamic Exploration</h3>
        <br />
        <p> 
          In addition to spatiotemporal exploration possibilities, individual counties or states are also interactive. An information window is enabled on hover, providing details on the location (i.e., state name or county name) and basic COVID-19 case and death data. Upon clicking, a county-specific data dashboard opens (on the right-hand side) with detailed health indicators and community risk factors. Data are updated by clicking on a new county. A graph showing new cases and smoothed trends for the selected county is updated on the left-hand side accordingly.
        </p>

        <Gutter h={40} />
        
        <h3>Thematic Mapping</h3>
        <br />

        <p>The Atlas provides <b>choropleth maps</b> for geovisualization, a thematic map style that represents data through various shading patterns on predetermined geographic areas (e.g., counties, states).</p>
        <br />
        <h2>CHOROPLETH MAPS: NATURAL BREAKS</h2>
        <ul>
          <li>
            For geo-visualization, we adopt jenks natural breaks maps to
            classify the values of the pandemic data for each state/county. A
            natural breaks map uses a nonlinear algorithm to create groups where
            within-group homogeneity is maximized, grouping and highlighting
            extreme observations.
          </li>
          <li>
            How it works: The Jenks break is a method designed by Jenks (1957)
            which assigns each observation to the best classification it could
            possibly belong to. It aims to find the best possible arrangement of
            the geographical units into classes, such that the deviation from
            the mean within classes is minimize, while the differences between
            classes in maximized. In other words, it aims to group more alike
            geographical units, while trying to maximize the differences between
            the groups created.
          </li>
          <li>
            For illustration purposes only, assume that we want to classify
            three counties based on its number of covid19 cases into two groups.
            The Jenks strategy works as follow:
            <br />
            <img
              className="jenks"
              src={`${process.env.PUBLIC_URL}/img/workflow_fig2a.png`}
              alt="Jenks natural breaks workflow diagram"
            />
            <img
              className="jenks"
              src={`${process.env.PUBLIC_URL}/img/workflow_fig2b.png`}
              alt="Jenks natural breaks workflow diagram"
            />
            <img
              className="jenks"
              src={`${process.env.PUBLIC_URL}/img/workflow_fig2c.png`}
              alt="Jenks natural breaks workflow diagram"
            />
          </li>
          <li>
            A formal description of the Jenks break could be found here: Jenks,
            GF (1967). The Data Model Concept in Statistical Mapping.
            International Yearbook of Cartography. 7: 186–190.
          </li>
        </ul>
        <Gutter h={40} />

        <h3>Spatial Statistics</h3>
        <br />
        <h2>HOT SPOT OVERVIEW</h2>
        <p>
          The Atlas team identified hot spots two ways: using the <b>total number of
          confirmed cases</b> and by <b>adjusting for population</b>. Because of the
          infectious nature of COVID, high numbers of cases anywhere will be of
          concern. At the same time, identifying areas that have a
          disproportionately high number of cases within the population is
          needed to locate areas hit hardest by the pandemic. 
        </p>
        <br />
          <p>
          The team further differentiates hot spot clusters and outliers: clusters are counties
          that have a high number of cases, and are surrounded by counties with
          a high number of cases. Outliers are areas that have a high number of
          cases within the county and fewer cases in neighboring counties,
          highlighting an emerging risk or priority for containment. </p>
          
        <h2>HOT SPOT ANALYSIS: LISA STATISTIC</h2>
        <p>
        Statistical spatial cluster identification based on local indicators of spatial association (LISA; Anselin, 2010, 2019; Anselin & Li, 2019) is implemented on case and death variables daily using an on-the-fly libgeoda service (see Section 2.3 for details). The clustering technique allows users to identify groups of contiguous counties that are statistically similar based on the COVID-19 indicator (accumulative COVID-19 cases, daily new cases, etc.). The “high-high” cluster, for example, can be of particular interest as it allows identification of a group of areas (i.e., counties, or states, in Atlas) where not only their own COVID-19 indicators are high but also they are surrounded by neighboring areas where the COVID-19 indicators are high.
        </p>
    
        <br />

        <p>
        We intentionally designed Atlas to be accessible to a wide audience. Therefore, we preset it with certain hyperparameters. Specifically, we use a first-order queen contiguity weight and one CPU core2 to estimate the local Moran's I, with 999 Monte Carlo permutations and a 0.05 threshold for statistical significance. However, using GeoDa,3 others can replicate these results or employ different hyperparameters, such as different spatial weights to measure geographical similarity, different randomization options (e.g., number of Monte Carlo permutations and specific seeds), or different thresholds for statistical significance.
        </p>

        <ul>
          <li>
            For more details:
            <ul>
              <li>
                <a
                  href="https://geodacenter.github.io/glossary.html#lisa2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GeoDa Glossary
                </a>
              </li>
              <li>
                <a
                  href="https://geodacenter.github.io/workbook/6a_local_auto/lab6a.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GeoDa: Local Spatial Autocorrelation
                </a>
              </li>
              <li>
                Anselin, Luc. 1995. “Local Indicators of Spatial Association —
                LISA.” Geographical Analysis 27: 93–115.
              </li>
              <li>
                Anselin, Luc. 2018. “A Local Indicator of Multivariate Spatial
                Association, Extending Geary’s c.” Geographical Analysis.
              </li>
              <li>
                Anselin, Luc, and Xun Li. 2019. “Operational Local Join Count
                Statistics for Cluster Detection.” Journal of Geographical
                Systems.
              </li>
            </ul>
          </li>
        </ul>
        <img
          className="hotspot"
          src={`${process.env.PUBLIC_URL}/img/confirmed_LISA.png`}
          alt="LISA hotspot map"
        />
        <p className="caption">
          County cluster hot spots(red) using confirmed cases of COVID-19
        </p>
        <img
          className="hotspot"
          src={`${process.env.PUBLIC_URL}/img/popweight_LISA.png`}
          alt="LISA hotspot map"
        />
        <p className="caption">
          County cluster hot spots(red) using population-weighted adjustment of
          COVID-19 cases
        </p>
        <Gutter h={40} />

        <h3>Limitations</h3>
        <br />
        <p>
          Known limitations exist regarding actual fatality rates, for example,
          as we may not be aware of the total population infected until testing
          is expanded. County estimates are in the process of being validated
          across multiple sources, and may still not be the most updated. Local
          health departments continue to serve as the most accurate, up-to-date
          sources. Our team continues to grow new collaborations to better
          identify the metrics needed for this rapidly changing situation.
          Issues are encouraged to be posted at{' '}
          <a
            href="https://github.com/geodacenter/covid/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/geodacenter/covid/issues
          </a>{' '}
          and/or by emailing{' '}
          <a
            href="mkolak@uchicago.edu"
            target="_blank"
            rel="noopener noreferrer"
          >
            mkolak@uchicago.edu
          </a>{' '}
          directly.
        </p>
        <Gutter h={40} />
      </ContentContainer>
      <Footer />
    </MethodsPage>
  );
};

export default Methodology;
