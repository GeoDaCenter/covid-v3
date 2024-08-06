# README

[![Netlify Status](https://api.netlify.com/api/v1/badges/f97601fe-2d82-482a-befe-b58f1bd7aa90/deploy-status)](https://app.netlify.com/sites/hardcore-wozniak-6dbde2/deploys)

The U.S. COVID-19 Atlas provided county-level visualizations and analytics to reveal a more detailed pandemic landscape with local hotspots of surging COVID cases that were missed by state-level data. The Atlas is live at: [https://USCovidAtlas.org](https://USCovidAtlas.org). 

![screenshot](https://github.com/GeoDaCenter/covid-v3/raw/master/public/img/screenshot.png)

## DATA

For more information about additional datasets used in the Atlas, see our Data page. Detailed data documentations about different variables and data sources are available at the [data-docs](public/data-docs) folder. 

### Current Release
Because there is no one single validated source for county-level COVID cases and deaths for real-time analysis, we incorporate multiple datasets from multiple projects to allow for comparisons. 
+ [*USAFacts*](https://usafacts.org/visualizations/coronavirus-covid-19-spread-map/?utm_source=MailChimp&utm_campaign=census-covid2):this dataset is provided by a non-profit organization. The data are aggregated from CDC, state- and local-level public health agencies. County-level data is confirmed by referencing state and local agencies directly.
+ [*1P3A*](https://coronavirus.1point3acres.com/en): This was the initial, crowdsourced data project that served as a volunteer project led by Dr. Yu Gao, Head of Machine Learning Platform at Uber. We access this data stream using a token provided by the group.
+ [*CDC*](https://covid.cdc.gov/covid-data-tracker): the US Center for Disease Control and Prevention is the nation's health protection agency. The data provided includes vaccination and county level testing data.
+ [*New York Times*](https://github.com/nytimes/covid-19-data): the New York Times newspaper releases time-series data compiled from state and local governments and health departments. The data is available via their github repository and was updated several times each day during the Pandemic.

We also include information from the following datasets: 
+ [American Community Survey](https://www.census.gov/programs-surveys/acs/technical-documentation/table-and-geography-changes/2018/5-year.html). We incorporate population data used to generate rates.
+ [COVIDCareMap](https://github.com/covidcaremap/covid19-healthsystemcapacity/tree/v0.2/data). Healthcare System Capacity includes Staffed beds, Staffed ICU beds, Licensed Beds by County. This data aggregated information about the healthcare system capacity with additions/edits allowed in real-time. It sourced data from the [Healthcare Cost Report Information System (HCRIS)](https://github.com/covidcaremap/covid19-healthsystemcapacity/tree/v0.2/data#healthcare-cost-report-information-system-hcris-data) and an open hospital facilities dataset by [Definitive Healthcare](https://github.com/covidcaremap/covid19-healthsystemcapacity/tree/v0.2/data#definitive-health-dh-data).
+ [County Health Rankings & Roadmaps](https://www.countyhealthrankings.org/explore-health-rankings/rankings-data-documentation): social, economic, and health indicators by County. 
+ [Native American Reservations](https://hifld-geoplatform.opendata.arcgis.com/datasets/54cb67feef5746e8ac7c4ab467c8ae64): boundary for Native American Reservations.
+ [Hypersegregated Cities](https://www.princeton.edu/news/2015/05/18/hypersegregated-cities-face-tough-road-change): boundary for historical and current hypersegregated cities. 
+ [Safegraph](https://docs.safegraph.com/docs/social-distancing-metrics): Data on mobility behavior over the course of the pandemic

Previously used  Datasets:
+ [Bin Yu Group](https://github.com/Yu-Group/covid19-severity-prediction): Predicted death counts and Severity index by County

<!-- ### Future Release -->
<!-- We have multiple datasets planned for future inclusion in the atlas, including: -->
<!-- ADDED >
<!-- + [Bin Yu Group](https://github.com/Yu-Group/covid19-severity-prediction): Hospital Severity Index forecasting by hospital location -->
<!-- + [Data.gov](http://data.gov): Indian Reservation Boundaries -->
<!-- + [NYTimes](https://github.com/nytimes/covid-19-data): Confirmed Cases and Deaths by County & State -->
<!-- + [DesCartes Lab](https://github.com/descarteslabs/DL-COVID-19): Mobility index by County -->
<!-- + [PlaceIQ, Couture et al](https://github.com/COVIDExposureIndices/COVIDExposureIndices): Limited Exposure Index by County  -->
<!-- + [HHS Hospital Data](https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility): Facility Level data on hospital occupancy. -->

### Data Details
<!-- You can download the most updated county level data merged with USAFacts [here](https://github.com/GeoDaCenter/covid/tree/master/): 
+ usafacts_confirmed_*date*.geojson: the county level data (confirmed cases) using [*USAFacts*](https://usafacts.org/visualizations/coronavirus-covid-19-spread-map/?utm_source=MailChimp&utm_campaign=census-covid2), together with population and number of hospital beds. 
+ usafacts_deaths_*date*.geojson: the county level data (death counts) using [*USAFacts*](https://usafacts.org/visualizations/coronavirus-covid-19-spread-map/?utm_source=MailChimp&utm_campaign=census-covid2), together with population and number of hospital beds. 
+ *date*_confirm_per10K_usafacts.gif: the animation (.gif) showing how the pandemic has been changing over time (using confirmed cases per 100K population), which is also displayed in the Atlas. The GIF is updated weekly. If you would like to get a more timely gif, send us an email (qinyunlin@uchicago.edu) and we can prepare that for you.   -->

#### 1P3A
To access raw 1P3A data, you must contact the 1P3A for a token directly.  

Not all cases from 1P3A data can be assigned to a particular county, see following (the list is being updated as new data comes in everyday) 
+ 1P3A does NOT assign cases in New York to specific counties, which includes New York City, Kings, Bronx, and Richmond.   
+ Cases reported for US Virgin Islands, Guam are NOT included.   
+ Cases in the following areas can NOT be assigned and hence are NOT included: Southwest Utah; Southeast Utah; Central Utah; Tri County, Utah; Kansas City, MO; Benton and Franklin, WA. 
+ Other unassigned cases (or “cases to be assigned”) are NOT included.
+ Cases reported in the Military and some Correctional Centers are NOT included. 

## METHOD

For a complete breakdown about the methods used in the Atlas, see our [Methods](https://uscovidatlas.org/methods.html) page.

The hotspot detection (a Local Indicator of Spatial Autocorrelation) is powered by **Geoda**. We also use many other features from **GeoDa** including natural breaks classification and cartogram techniques. See below for how one can apply these methods to reproduce the results using above datasets.  

+ [Natural breaks choropleth map](http://geodacenter.github.io/workbook/3a_mapping/lab3a.html#natural-breaks-map)
+ [Cartogram](http://geodacenter.github.io/workbook/3a_mapping/lab3a.html#cartogram)
+ [Queen contiguity spatial weights creation](http://geodacenter.github.io/workbook/4a_contig_weights/lab4a.html#queen-contiguity)
+ [Local Moran statistics](http://geodacenter.github.io/workbook/6a_local_auto/lab6a.html#local-moran)
+ [Univariate Local Indicator of Spatial Autocorrelation (LISA)](http://geodacenter.github.io/workbook/6a_local_auto/lab6a.html)
+ [Dot Density Mapping](https://www.arcgis.com/home/item.html?id=978dac719e794236bf93c4ede7e80eaa)

More information about the Geoda project can be found [here](https://geodacenter.github.io/).

## COLLABORATORS
The US Covid Atlas open-science collaboration project was comprised of a coalition of research partners that were been integral to developing and expanding the Covid Atlas to meet the needs of health practitioners, planners, researchers, and the public. 

### Team
Check out the **Team** page for more information about the many contributors to the *Atlas*: [https://uscovidatlas.org/about#team](https://uscovidatlas.org/about#team). 

### Advisory
The **Advisory** page details information about the Community Advisory Board: [https://uscovidatlas.org/about#advisory](https://uscovidatlas.org/about#advisory).

### Research Partners: 
+ [Healthy Regions & Policies Lab (HEROP)](https://healthyregions.org) and the [Center for Spatial Data Science](https://spatial.uchicago.edu/) (CSDS) at the University of Chicago, and later, the University of Ilinois. The Atlas was originally developed as a project co-led by Marynia Kolak, Xun Li, and Qinyun Lin at the Center for Spatial Data Science. The HEROP Lab at CSDS led the project until late 2022, when HEROP moved to the University of Illinois at Urbana-Champaign, where it remains as its home institution. 
+ [The Yu Group](https://www.stat.berkeley.edu/~yugroup/people.html) at UC Berkeley’s Department of Statistics is working with [Response4Life](https://response4life.org/) to develop a [severity index](https://github.com/Yu-Group/covid19-severity-prediction) for each hospital to help distribute supplies when they become available. The Yu Group generates daily updates of COVID data and contributes both hospital and county-level severity index data for the Atlas. 
+ [County Health Rankings & Roadmaps (CHR&R)](https://www.countyhealthrankings.org/) led by Lawrence Brown. CHR’s goal is to improve health outcomes for all and to close the health gaps between those with the most and least opportunities for good health. CHR leads efforts to connect socioeconomic and health vulnerability indicators to the Atlas to better contextualize and inform findings.
+ [CSI Solutions](https://spreadinnovation.com/) led by Roger L. Chaufournier and Kathy Reims are critical to connecting the Atlas with rural health partners across the country to define and prioritize needs for care management during the pandemic. CSI leads efforts in developing and refining this “Communities of Practice” forum.
+ [AFI DSI COVID-19 Research Group](https://datascience.wisc.edu/covid19/) at UW-Madison. This group led by [Brian Yandell](https://datascience.wisc.edu/covid19) was an early institutional partner to amplify regional efforts to respond to the pandemic. Kevin Little of [Informing Ecological Design](https://www.iecodesign.com) was critical in connecting the Atlas team with a nationwide network and leading user-group sessions to review the atlas, align priorities, and ensure it was effective for a wide audience. [Steve Goldstein](https://biostat.wiscweb.wisc.edu/staff/goldstein-steve/) continued to work with the team in data validation efforts.

## RESOURCES

### Learn
There are multiple resources the learn more about the data, methods, technical infrastructure, and more at the main Covid Atlas site:
+ [Learn Toolkit](https://uscovidatlas.org/learn)
+ [Analytic Methods](https://uscovidatlas.org/methods)
+ [Commonly Asked Questions During the Pandemic](https://uscovidatlas.org/faq)
+ [Atlas Published Research](https://uscovidatlas.org/insights#research)
+ [Covid Atlas Insights Research Blog](medium.com/covidatlas)
+ [Oral Histories Project: Atlas Stories](https://stories.uscovidatlas.org/)

### Questions
If you have a question regarding a specific dataset, please contact the dataset author(s) directly. If you have any questions regarding the Atlas, contact us by via: [https://uscovidatlas.org/contact](https://uscovidatlas.org/contact)

### Citations
Please cite us according to how you used the US Covid Atlas: 

**Website**: Marynia Kolak, Qinyun Lin, Dylan Halpern, Susan Paykin, Aresha Martinez-Cardoso, and Xun Li. The US Covid Atlas, 2022. Center for Spatial Data Science at University of Chicago. https://www.uscovidatlas.org

**Published Work of** *beta* **Version**: Kolak, Marynia, Xun Li, Qinyun Lin, Ryan Wang, Moksha Menghaney, Stephanie Yang, and Vidal Anguiano Jr. "The US COVID Atlas: A dynamic cyberinfrastructure surveillance system for interactive exploration of the pandemic." *Transactions in GIS* 25, no. 4 (2021): 1741-1765.

**Codebase of** *beta* **Version**: Xun Li, Qinyun Lin, Marynia Kolak, Robert Martin, Stephanie Yang, Moksha Menghaney, Ari Israel, Ryan Wang, Vidal Anguiano Jr., Erin Abbott, Dylan Halpern, Sihan-Mao. (2020, October 12). GeoDaCenter/covid: beta (Version beta). Zenodo. http://doi.org/10.5281/zenodo.4081869

--- 

## INFRASTRUCTURE DETAILS

### Current Repos, Subdomains and branches of the Atlas

Repositories
- Main Repo: [geodacenter/covid-v3](https://github.com/geodacenter/covid-v3)
- Archive Repo: [geodacenter/covid](https://github.com/geodacenter/covid)
- Stories Repo (Private): [geodacenter/covid-stories](https://github.com/GeoDaCenter/covid-histories)

URLs
- Main: [https://uscovidatlas.org/](https://uscovidatlas.org/): Main site, built using `yarn build` or `yarn netlify-build` to include pre-build data fetching and parsing 
- Dev: [https://dev.uscovidatlas.org/](https://dev.uscovidatlas.org/): Dev site, built using same command as above on the dev branch
- Docs: [https://docs.uscovidatlas.org/](https://docs.uscovidatlas.org/): JSDocs site for the Atlas, generated from `yarn docs` 
- Stories: [https://stories.uscovidatlas.org/](https://stories.uscovidatlas.org/): Stories site, a next.js site. See [Stories repo](https://github.com/GeoDaCenter/covid-histories) for more info.

There are various other branch deploys on the US Covid Atlas web hosting (netlify) that are not publicly listed.

### Running the React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Required Environment Variables

`REACT_APP_MAPBOX_ACCESS_TOKEN=<token>` Enter your mapbox token (must have access to the resources that are hard-coded into the `style.json` and `style_light.json` files).

`REACT_APP_ALERT_POPUP_FLAG=false` Just leave this "false".

Variables to connect with the Covid Stories content:

```
REACT_APP_EMAIL_FORM_URL=
REACT_APP_STORIES_PUBLIC_URL=
```

The following are all related to Google BigQuery credentials:

```
BIGQUERY_PROJECT_ID=
BIGQUERY_CLIENT_ID=
BIGQUERY_CLIENT_EMAIL=
BIGQUERY_CLIENT_X509_CERT_URL=
BIGQUERY_SECRET_KEY=
BIGQUERY_SECRET_KEY_ID=
```

### Env in production and workflows

All of the above variables (and perhaps a couple of others must also exist in the Netlify environment. If the data-pull-1.yml workflow is enabled, then the BigQuery variables must also be added to this repositories list of secrets.

#### Quickstart

1. Clone this repository
2. Use `cp .env.example .env` to create a local .env file and update values as needed.
3. Install node / npm, and install yarn with `npm i -g yarn`
4. From the repository root, run `yarn` to install dependencies
5. From the repository root, run `yarn fetch-data` to fetch the latest data
6. From the repository root, run `yarn start` to start the app

### Available Scripts

In the project directory, you can run:

#### `yarn fetch-data`

Updates the data in the public data directory as required by the frontend application.
#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn docs`
Generates JSDoc site, output to the folder `jsdocs`. See `jsdoc` folder for configuration.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
