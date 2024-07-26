import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Grid from "@mui/material/Grid";

// import Grid from '@mui/material/Grid';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { NavBar, Footer, ContentContainer, Gutter } from '../../components';
import colors from '../../config/colors';

const FaqPage = styled.div`
  background: white;
`;

// const ButtonContainer = styled(Grid)``;

// const TutorialButton = styled.button`
//   width: 100%;
//   border: 1px solid ${colors.lightgray};
//   text-align: left;
//   padding: 10px 20px;
//   background: white;
//   transition: 250ms all;
//   cursor: pointer;
//   &:hover {
//     box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
//       0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
//   }
//   p {
//     padding: 10px 0;
//   }
// `;

const Usage = styled.span`
  background: ${(props) => colors[props.color]};
  padding: 10px 15px;
  border-radius: 15px;
  font-weight: bold;
  line-height: 4;
  font-size: 1rem;
  transform: translateY(-100%);
`;

const Feature = styled(Grid)`
  text-align: center;
  h5 {
    font-family: "Playfair Display", serif;
    font-size: 19px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${colors.skyblue};
    margin-bottom: 20px;
  }
  img {
    margin: 20px auto;
    width: 100%;
    max-width: 100px;
  }
  img.responsive {
    max-width: 100%;
  }
  p {
    color: white;
    font-family: Lato;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.63;
    letter-spacing: normal;
    color: ${colors.white};
    @media (max-width: 960px) {
      max-width: 400px;
      margin: 0 auto 40px auto;
    }
  }
`;

const CenteredGrid = styled(Grid)`
  display: flex;
  align-content: center;
  padding-top: 4em;
`;

const Accordion = styled(MuiAccordion)`
  &.MuiPaper-elevation1 {
    box-shadow: none;
    border: 1px solid ${colors.white};
    transition: 250ms border;
    &.Mui-expanded {
      border: 1px solid ${colors.lightgray};
      box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
        0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
    }
  }
`;

const AccordionSummary = styled(MuiAccordionSummary)``;

const AccordionDetails = styled(MuiAccordionDetails)``;

const faqQuestions = [
  // {
  //     'header': 'What data do you use for COVID cases?',
  //     'content': 'Because there is no single, authoritative source of COVID case data in the United States, we use multiple sources. We include 1P3A data, a crowdsourced dataset from international volunteers that offered the first available county-level data for public use in early March. We also include USAFacts data, a journalistic dataset that made county-level data available in March. In future releases, we may also incorporate county-level reports by NYT and John Hopkins University. We recommend checking across multiple data sources, and validating against local health department numbers.'
  // },
  // {
  //     'header': 'When will you add hospitalization data?',
  //     'content': 'At this time, hospitalization data is not available in a single data source for all counties across the United States. If this changes, we will be certain to incorporate it.'
  // },
  // {
  //     'header': 'When will you add COVID case data by race, age, and demographics?',
  //     'content': 'At this time, data is not available by race, age, and demographics in a single data source for all counties across the United States. If this changes, we will be certain to incorporate it. There are several projects we recommend for state-wide metrics for race and ethniciy data, including the <a href="https://covidtracking.com/race/dashboard/" target="_blank" rel="noopener noreferrer">Racial Dashboard</a> by CovidTracking.com and <a href="http://d4bl.org/" target="_blank" rel="noopener noreferrer">Data 4 Black Lives</a>.'
  // },
  // {
  //     'header': 'Do you have a 7-day average?',
  //     'content': 'Yes, we recently added 7-Day Average Daily Confirmed Count. We calculated this variable by taking the difference between the current day’s confirmed count and the confirmed count 7 days ago, and then dividing this difference by 7. For example, we took the difference between the confirmed count as of June 30th and that as of June 23rd, divided the difference by 7, then used this as an estimate for 7 Day Average Daily Confirmed Count for June 30th. Technically speaking, this measures the daily average growth for the week right before June 30th. Also note that this calculation is only available with USAFacts data because of data completeness (1P3A has several days’ data missing in January and February).'
  // },
  // {
  //     'header': 'Why do you have multiple data sources available? ',
  //     'content': 'Because there is no one single authoratative, validated source for county-level COVID cases and deaths for real-time analysis, we incorporate multiple datasets from multiple projects to allow for comparisons. For more information about each data source see our <a href="/data">Data</a> page.'
  // },
  // {
  //     'header': 'Should I be concerned about other areas than in High-High clusters?',
  //     'content': 'High-Low & Low-High clusters refer to Outliers. These are areas that have a high (and low in Low-High) number of cases within the county and a low (and high in High-Low) number of cases in neighboring counties, highlighting an emerging risk or priority for containment.'
  // },
  // {
  //     'header': 'Why do you focus on county-level and not state-level changes?',
  //     'content': 'County-level visualizations show a dramatically more detailed pandemic landscape, while aggregate data alone can miss local hot spots of surging COVID cases. If one only looks at state-level data, a county cluster would have to be extreme to show up, and by then it might be too late for prevention measures to be enacted.'
  // },
  // {
  //     'header': 'What is the difference betweeen Natural Breaks (fixd bins) and Natural Breaks under Choropleth?',
  //     'content': `With the fixed bins option, the legend stays the same as you go back in time. This makes it easier to watch the spread of COVID over time. In the other option, the legend changes each day, adjusting for the optimal classification according to how many cases exist for that day. <br/><br/>
  //     For a more technical response; both use a non-linear algorithm to group observations such that within-group homogeneity is maximized. However, the Natural Breaks (fixed bins) option applies the algorithm to the data for the most recent date and uses the same bins to group observations for historical data. This allows us to better visualize the pandemic spread over time. The Natural Breaks option, on the other hand, uses a non-linear algoritm to group observations for every day's data, which results in maxized within-group homogeneity for every day's data, but difficult to visualize changes over time.
  //     `
  // }
  {
    header: 'What data can I visualize using the US COVID Atlas?',
    content: (
      <p>
        The Atlas features COVID pandemic and community
        contextual data across the duration of the Pandemic. On
        our <NavLink to="/data">Data</NavLink> page, you can find high-level
        summaries of all the datasets currently featured on the Atlas. This page
        also includes links to our{' '}
        <a
          href="https://github.com/GeoDaCenter/covid-v3"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        , detailed data descriptions, key variables and their definitions, and
        other notes on sourcing and limitations.
        <br />
        <br />
        Data includes county- and state-level COVID case counts and infection
        rates, death rates, testing rates, and vaccination rates (only
        available from the CDC at the state-level). To provide a robust
        understanding of the scale and scope of the Pandemic’s impact, we also
        incorporate data on health system capacity, hospital forecasting,
        mobility trends, as well as community health characteristics.
        <br />
        <br />
        We’ve also included data to call attention to marginalized and
        vulnerable communities particularly hard hit by COVID -- and help with
        efforts to track and implement an equitable recovery. Through selecting
        an Overlay option, you can explore data and trends in hypersegregated
        cities and their surrounding metropolitan regions, Native American
        tribal lands, and Southern Black Belt counties.
      </p>
    ),
  },
  {
    header: 'How was the Atlas used during the Covid-19 Pandemic?',
    content: (

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
          <p>The Atlas was used in multiple ways. Below we higlight five core 
          usage scenarios common in earlier stages of the Pandemic, as they were 
          shared on the orginal home page. Check out addditional 
          <a href="http://uscovidatlas.org/insights"> insights</a> from the Atlas team,
          <a href="http://uscovidatlas.org/learn"> learn</a> how to explore the Pandemic historically, and/or read about more ways 
          that the Atlas was used in our <a href="#"> evaluation</a> report (coming soon!)</p>
          </Grid>
          <Grid item xs={12} md={6}>
          <Usage color="yellow">Usage #1</Usage>
            <h5>Identifying Regional Hotspots for Mitigation</h5>
            <p>
              Users could generate spatial statistics to detect hot spots with raw case
              data or by adjusting for population. Because of the
              infectious nature of COVID, high numbers of cases anywhere
              would be of concern. At the same time, identifying areas that
              had a disproportionately higher number of cases within the
              population was necessary to locate areas hit hardest by the
              Pandemic.
            </p>
          </Grid>
          <Grid item xs={12} md={6}>
            <video autoPlay={true} muted={true} loop={true}>
              <source
                src={`${process.env.PUBLIC_URL}/img/use_case1.mp4`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Gutter h={10} />
          <Grid item xs={12} md={6}>
            <Usage color="orange">Usage #2</Usage>
            <h5>Tracking patterns to better plan ahead</h5>
            <p>
              Users could visualize change over time to better understand the
              distribution and spread of COVID in the US throughout the
              Pandemic. Moving the time slider or clicking the play
              button enabled the user to watch the spread of COVID. Analyzing patterns of
              the spread was essential to support planning for resource allocation.
            </p>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={`${process.env.PUBLIC_URL}/img/Landingpage_usage2.gif`}
              height = "350"
              alt="Use Case 2: Tracking COVID Patterns over time"
              loading="lazy"
            />
          </Grid>
          <Gutter h={10} />
          <Grid item xs={12} md={6}>
          <Usage color="yellow">Usage #3</Usage>
            <h5>
              Forecasting viral spread at state and county
              levels
            </h5>
            <p>
              Switching between the state and county thematic maps helped zero in on 
              COVID clusters at a local level. Then,
              selecting and tracking hotspots over time using the Local Moran's
              I statistic helped confirm and explore areas of concern. 
              The Atlas served as a powerful visual analytic tool to find
              COVID spillovers along state borders, emerging from one
              county to areas nearby, and more.
            </p>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={`${process.env.PUBLIC_URL}/img/Landingpage_usage3.gif`}
              height = "350"
              alt="Use Case 3: Forecasting viral spreads"
              loading="lazy"
            />
          </Grid>
          <Gutter h={10} />
          <Grid item xs={12} md={6}>
            <Usage color="orange">Usage #4</Usage>
            <h5>Making visible vulnerable communities</h5>
            <p>
              Users could click on counties to get more information about community
              health factors and socioeconomic indicators like average
              length of life in an area, percent uninsured, or income
              inequality metrics. In the main selection panel, overlaying
              segregated cities or Native American Reservation boundaries
              could help identify uniquely vulnerable locales.
            </p>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={`${process.env.PUBLIC_URL}/img/Landingpage_usage4.gif`}
              height = "350"
              alt="Use Case 4: Make visible vulnerable communities"
              loading="lazy"
            />
          </Grid>
          <Gutter h={10} />
          <Grid item xs={12} md={6}>

          <Usage color="yellow">Usage #5</Usage>
            <h5>Identifying emerging risk</h5>
            <p>
              The Atlas enabled exploring how hotspots progressed or diminished over time, 
              and also helped identify
              areas of emerging risk early. Some hotspots began as spatial
              outliers -- shown as pink in the map, meaning cases were high
              in that county but low in neighboring counties. If cases
              continued to grow and spillover nearby counties, the areas
              would turn red. Mature hotspots were defined as clusters of counties that
              remained red over time, and continued to grow.
            </p>

          </Grid>
          <Grid item xs={12} md={6}>
          <img
              src={`${process.env.PUBLIC_URL}/img/Landingpage_usage5.gif`}
              height = "350"
              alt="Use Case 5: Forecasting viral spreads"
              loading="lazy"
            />
          </Grid>
        </Grid>
    ),
  },
  {
    header:
      'Why are there multiple data sources for COVID case and death rates?',
    content: (
      <p>
        The impact of COVID-19 reaches far beyond a single data metric. The
        Atlas makes multiple COVID and community context variables available in
        order to paint a more complete picture of the ways in which the Pandemic
        has affected different communities in different ways.
        <br />
        <br />
        For variables like COVID cases and death rates, we provide multiple data
        sources in order to allow users to compare and contrast reported data.
        This was particularly important earlier in the Pandemic. For most of the
        first year, there had been no single, authoritative
        source of COVID case data in the United States. When we launched the
        Atlas in mid-March, we incorporated data from{' '}
        <a
          href="https://coronavirus.1point3acres.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          1Point3Acres
        </a>
        , a crowdsourced dataset from international volunteers that offered the
        first available county-level data for public use, as well as USAFacts, a
        journalistic dataset making county-level data available early on. As the
        Atlas has expanded and evolved alongside national data collection and
        reporting efforts, we also incorporated county-level reports from{' '}
        <a
          href="https://github.com/nytimes/covid-19-data"
          target="_blank"
          rel="noopener noreferrer"
        >
          The New York Times
        </a>
        . We sourced COVID vaccination rates and testing data directly from the{' '}
        <a
          href="https://covid.cdc.gov/covid-data-tracker/#datatracker-home"
          target="_blank"
          rel="noopener noreferrer"
        >
          CDC
        </a>
        .
      <br />      <br />
        Our <a href="https://www.tandfonline.com/doi/full/10.1080/15230406.2021.1975311">
        research</a> has further demonstrated the importance of reviewing multiple COVID-19 data metrics.
      </p>
    ),
  },
  {
    header: 'Why the focus on county-level data?',
    content: (
      <><p>
        County-level visualizations show a dramatically more detailed pandemic
        landscape, while state-level or national aggregate data may obscure
        local hotspots of surging cases. By focusing on state-wide or even
        national metrics, it’s easy to miss rapidly surging cases locally and
        spillover across state boundaries. County-level data (and finer
        resolution, when available) is critical for targeting efforts, whether
        isolating virus spread or identifying a disproportionately hit area for
        recovery priority.
      </p><br />
      <p>
          The US Covid Atlas was the <a href="https://news.uchicago.edu/story/state-level-data-misses-growing-coronavirus-hot-spots-us-including-south"> first dashboard </a>

          to visualize data at both state
          and county-scale as total cases, deaths, and population-weighted rates to provide
          a richer understanding of the pandemic.
        </p></>

    ),
  },
  {
    header: 'Could users track vaccination rates in their state or region during the Pandemic?',
    content: (
      <p>
        Yes. The Atlas featured three vaccination metrics, sourced
        from the CDC:
        <i>
          First Dose Administered, Second Dose Administered, and Doses to be
          Distributed.
        </i>
        <br />
        <br />
        The <i>Doses to be Distributed variable</i> is taken from the total
        doses distributed subtracted by the total doses administered. This gives
        an estimation of the number of doses "on hand" for each state. See our
        detailed data descriptions for more information.
      </p>
    ),
  },
  {
    header: 'How can I explore trends in vulnerable populations?',
    content: (
      <><p>
        COVID disproportionately impacted communities of color and
        low-income communities across the country, exacerbating already-existing
        disparities. To draw attention to these disparities and help with
        efforts to track and implement an equitable recovery, there are several
        ways to highlight vulnerable populations using the Atlas.
        <br />
        <br />
        Through selecting an Overlay option, you can explore data and trends in{' '}
        <b>
          <a
            href="https://www.princeton.edu/news/2015/05/18/hypersegregated-cities-face-tough-road-change"
            target="_blank"
            rel="noopener noreferrer"
          >
            hypersegregated cities
          </a>
        </b>{' '}
        (and their metropolitan areas),
        <b>
          <a
            href="https://www.cdc.gov/tribal/tribes-organizations-health/tribes/reservations.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Native American Tribal Reservations
          </a>
        </b>
        , and
        <b>
          <a
            href="https://en.wikipedia.org/wiki/Black_Belt_in_the_American_South"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Southern Black Belt counties
          </a>
        </b>
        . Use these overlay features to examine at trends in a single area (for
        example, selecting Hypersegregated Cities and zooming in on Chicago),
        region (viewing multiple metropolitan area counties in the Midwest) or
        nationally (exploring trends across all hypersegregated cities). You can
        also visualize and map several of these community health factors,
        including Uninsured Percent, Over 65 Years Percent, Life Expectancy, and
        Percent Essential Workers.
        <br />
        <br />
        You can also easily access more than a dozen community health indicators
        for every county. Sourced from
        <a
          href="https://www.countyhealthrankings.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          County Health Rankings
        </a>
        , this data includes metrics on median income, childhood poverty,
        unemployment rates, uninsured rates, racial segregation, drug overdose
        deaths, and more. Click on a county (or multiple counties with ctrl
        click), then the Report button on the right side of the map. Scroll down
        for the full data report.
      </p>
      <br />
      <p>
          Read more about mapping community context in the <a href="https://uscovidatlas.org/learn">learn toolkit</a>.
        </p></>
    ),
  },
  {
    header: 'What do mobility metrics show?',
    content: (
      <p>
        Three mobility metrics were added to the Atlas:{' '}
        <i>Percent Home on Workdays, Percent Full Time on Workdays, </i>
        and <i>Percent Part Time on Workdays</i>. These metrics reflect the
        percent of devices observed as completely at home, at a workplace for
        6-8 hours (full time), or at a workplace for 3-6 hours (part time) for
        each day included. They are sourced from Safegraph’s{' '}
        <a
          href="https://docs.safegraph.com/docs/social-distancing-metrics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Social Distancing Metrics
        </a>
        .
        <br />
        <br />
        We also added an <i>Essential Workers</i> data layer to
        contextualize these mobility metrics. This variable (found under
        Variables {`>`} Community Health Information) estimates the percentage
        of adult workers in essential occupations, based on 2019 American
        Community Survey county-level estimates.
        <br />
        <br />
        More about Safegraph’s mobility data: Safegraph provides U.S. Census
        block group level data that reports mobile phone device activity
        reported from apps that collect location data, which we then aggregate
        up to the county and state level for Atlas mapping. Safegraph data is
        generated from a series of location pings throughout the day, which
        determine various behaviors, such as staying completely home, full time
        work, part time work, and delivery (multiple, short visits). See our{' '}
        <NavLink to="/data">detailed data descriptions</NavLink> for more
        information.
      </p>
    ),
  },
  {
    header:
      'Can you explain the Map Type options? What’s the difference between natural breaks, box maps, and hotspot maps?',
    content: (
      <><p>
        We provide multiple <i>Map Type</i> options to facilitate different
        views for exploratory analysis. Different maps emphasize different
        aspects of the data, and can help reveal and communicate data insights
        in different ways. You can select and view data as any or all of the
        following Map Types, and then dive deeper by comparing different
        Visualization Types (2D, 3D, or Cartogram) for each map.
        <br />
        <br />
        <b>Natural Breaks maps</b> use color to show the count or
        percentage of a variable. The Atlas uses color to show the counts and
        percentages of COVID cases, deaths, testing, vaccinations, mobility, and
        community health contextual factors.
        <br />
        <br />
        <b>Box maps</b> are useful for detecting outliers and gaining an
        overview of the spread of the data distribution. Box maps group values
        (i.e. COVID case counts or rates) into six fixed categories: Four
        quartiles (1-25%, 25-50%, 50-75%, and 75-100%) plus two outlier
        categories at the low and high end of the distribution.
        <br />
        <br />
        <b>Hotspot maps</b> show local clusters of areas where neighbors share a
        particular quality, such as high rates or numbers of confirmed COVID
        cases. A hotspot is an area (on the Atlas, an area is a state or county)
        that is significantly different from the areas surrounding it. On these
        maps, a hotspot may be one area, or a cluster of areas. 
      </p><br /><p>
          Read more about mapping styles on the <a href="https://uscovidatlas.org/methods">Methodology</a> page.
        </p></>
    ),
  },
  {
    header:
      'During the Pandemic, were users concerned about hotspot areas other than "High-High" clusters?',
    content: (
      <><p>
        The Atlas shows four types of hotspot areas. High-High areas are
        significant because they indicate areas with high numbers or rates that
        are surrounded by neighbors also with high numbers, compared to the rest
        of the country. However, each of the four types represents a
        statistically significant trend:
        <br />
        <br />
        <ul>
          <li>
            <b>High-High:</b> Areas with high numbers whose neighbors also have
            high numbers or rates. Bright red counties have a significantly high
            number of cases or deaths, or significantly fewer hospital beds per
            case. Neighbors for these areas also have high numbers.
          </li>
          <li>
            <b>Low-Low:</b> Areas with low numbers whose neighbors also have low
            numbers or rates. Bright blue counties have significantly fewer
            cases or deaths, or significantly more hospital beds per case.
            Neighbors for these areas also have a low number of cases.
          </li>
          <li>
            <b>High-Low:</b> Areas with high numbers whose neighbors have low
            numbers or rates. This type of hot spot is also called an outlier,
            because it differs so much from its neighbors. Pale red counties
            have more cases, deaths, or fewer hospital beds per case than do
            their immediate neighbors. The surrounding areas may experience
            significant spread of the virus in future weeks.
          </li>
          <li>
            <b>Low-High:</b> Areas with low numbers whose neighbors have high
            numbers or rates. This type of hot spot is also called an outlier,
            because it differs so much from its neighbors. Pale blue counties
            have fewer cases, deaths, or more hospital beds per case than do
            their immediate neighbors. These areas may experience significant
            spread of the virus from surrounding areas in future weeks.
          </li>
        </ul>
      </p><br />
      <p>
          Read more about Hot Spot statistics on the <a href="https://uscovidatlas.org/methods">Methodology</a> page.
        </p></>
    ),
  },
  {
    header: 'Can I load my own data and view it in the Atlas?',
    content: (
      <p>
       Yes, this feature was added to the Atlas. 
       See the tutorial on <a href="https://uscovidatlas.org/learn/add-custom-data">
       Adding Custom Data</a>. You can also generate a <a href="https://uscovidatlas.org/learn/create-a-report">
      Custom Report</a> for your community.
      </p>
    ),
  },
  {
    header: 'When will you add COVID case data by race, age, and demographics?',
    content: (
      <><p>
        As of 2024, COVID data is still not available by race, age, and demographics
        in a single data source for all counties across the United States.
      </p><br /><p>
          During the Pandemic, we recommended several
          projects that compiled state-wide COVID race and ethnicity data
          while also advocating for greater county-level data reporting, including
          the{' '}
          <a
            href="https://covidtracking.com/race/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
          >
            COVID Racial Data Dashboard
          </a>{' '}
          and{' '}
          <a
            href="https://d4bl.org/covid19-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data 4 Black Lives
          </a>
          . Check out a workshop we hosted with keynote Jamelle Watson-Daniels who spoke on
          these challenges for more details (<a href="https://www.youtube.com/watch?v=9x2EegPLmOg">via Youtube</a>).
        </p></>
    ),
  },
  {
    header:
      'Where can I learn more about insights that the Atlas is generating?',
    content: (
      <p>
        Check out <NavLink to="/insights">Atlas Insights</NavLink> for published research, briefs, and
        access to the US Covid Atlas Blog. The Blog includes multiple updates from the research coalition,
        workshop highlights, and past updates over the course of the Pandemic.
      </p>
    ),
  },
];

export default function Faq() {
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // const goTo = (page) => (window.location.href = page);
  return (
    <FaqPage>
      <NavBar light />
      <ContentContainer>
        <h1>FAQs</h1>
        <hr />
        
        {/* <ButtonContainer container spacing={2}>
          <Grid item xs={12} md={6}>
            <TutorialButton onClick={() => goTo('choropleth')}>
              <h3>Choropleth Maps</h3>
              <p>
                Explore counts and percentages of cases, deaths, and hospital
                beds.
              </p>
            </TutorialButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <TutorialButton onClick={() => goTo('hotspot')}>
              <h3>Hotspots</h3>
              <p>Find groups of counties and states affected by the virus.</p>
            </TutorialButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <TutorialButton onClick={() => goTo('trends')}>
              <h3>Emerging Trends</h3>
              <p>
                Locate areas that will soon be significantly affected by virus.
              </p>
            </TutorialButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <TutorialButton onClick={() => goTo('time')}>
              <h3>Change Over Time</h3>
              <p>See the history of the virus by county and state.</p>
            </TutorialButton>
          </Grid>
        </ButtonContainer>
        <Gutter h={40} /> */}

        <h2>FREQUENTLY ASKED QUESTIONS, AND THEIR ANSWERS.</h2>
        <p>
          These questions were posed to the U.S. Covid Atlas team over the duration of the Pandemic. 
          We retain them for archival purposes, and add context.
        </p>
        <hr />
        {faqQuestions.map((question, index) => (
          <Accordion
            square
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              aria-controls={`panel${index}d-content`}
              id={`panel${index}d-header`}
            >
              <Typography>
                <b>{question.header}</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{question.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <Gutter h={40} />
        
        {/* <h2>LEARNING COMMUNITY</h2>
        <hr />
        <p>
          The{' '}
          <a
            href="https://covidatlas.healthcarecommunities.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Atlas Learning Community
          </a>{' '}
          is project by{' '}
          <a
            href="https://www.spreadinnovation.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CSI Solutions
          </a>{' '}
          to provide Atlas super-users, health practioners, and planners a place
          to interact. It is moderated by coalition members. Ask questions,
          provide feedback, and help make the Atlas Coalition stronger!
        </p>
        <Gutter h={40} /> */}
        
      </ContentContainer>
      <Footer />
    </FaqPage>
  );
}
