import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavBar, Footer, ContentContainer, Gutter } from '../../components';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import colors from '../../config/colors';
const ContactPage = styled.div`
  background: white;
  h1 {
    display: inline-block;
    margin-right: 20px;
  }
  a.social-icon {
    img {
      width: 30px;
    }
    display: inline-block;
    margin: 5px 10px 0 0;
    opacity: 0.6;
    transition: 250ms all;
    &:hover {
      opacity: 1;
    }
  }
  textarea, .MuiInputBase-root {
    color:black;
  }
`;

const ContactForm = styled.form`
  &.locked {
    user-select: none;
    pointer-events: none;
    opacity: 0.5;
  }
  border: 1px solid black;
  padding: 2rem;
  margin: 20px 0;
`;

const InputBlock = styled.div`
  padding: 0.5rem 0;
  padding-top: ${(props) => (props.fullWidth ? '2rem' : '0.5rem')};
  display: block;
  #message {
    width: 100%;
  }
  .MuiInputBase-root,
  .MuiFormControl-root,
  .MuiFormLabel-root {
    min-width: 75%;
    width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
    font-family: 'Lato', sans-serif;
    @media (max-width: 960px) {
      width: 100%;
    }
  }
  button#submit-form {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1.75px;
    line-height: 3;
    text-align: center;
    text-transform: uppercase;
    background-color: ${colors.blue};
    color: ${colors.white};
    padding: 0 20px;
    border-radius: 0.3rem;
    text-decoration: none;
    border: none;
    float: right;
    display: block;
    cursor: pointer;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0);
    transition: 250ms all;
    &:hover {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35);
    }
    @media (max-width: 960px) {
      margin: 0 auto;
      float: initial;
    }
  }
`;

const SuccessMessage = styled.div`
  padding: 20px;
  background: ${colors.teal};
  position: relative;
  margin: 2rem 0;
  p {
    color: white;
    font-weight: bold;
    margin-right: 2rem;
  }
  button {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
  }
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

const AccordionDetails = styled(MuiAccordionDetails)`
  flex-direction: column;
  p {
    display: block;
  }
`;

const press = {
  2020: [
    {
      name: 'NPR - All Things Considered:',
      link: 'https://www.npr.org/2020/07/02/886845325/coronavirus-in-the-u-s-where-the-hotspots-are-now-and-where-to-expect-new-ones',
      text: 'Coronavirus in the US -- Where the hotposts are now and where to expect new ones. ',
      date: '(July 2, 2020)',
    },
    {
      name: 'Politico:',
      link: 'https://www.politico.com/newsletters/politico-nightly-coronavirus-special-edition/2020/06/10/dont-call-it-a-second-wave-489488',
      text: 'POLITICO Nightly: Coronavirus Special Edition, ???Don???t Call it a Second Wave ',
      date: '(June 12, 2020)',
    },
    {
      name: 'Washington Post:',
      link: 'https://www.washingtonpost.com/news/powerpost/paloma/the-health-202/2020/06/01/the-health-202-the-summer-fight-against-the-coronavirus-will-be-a-local-one/5ed1753188e0fa32f822de79/',
      text: 'The Health 202: The summer fight against the coronavirus will be a local one ',
      date: '(June 1, 2020)',
    },
    {
      name: 'Politico:',
      link: 'https://www.politico.com/newsletters/politico-nightly-coronavirus-special-edition/2020/05/12/pelosis-pandemic-strategy-489203',
      text: 'POLITICO Nightly: Coronavirus Special Edition, ???Pelosi???s Pandemic Strategy',
      date: '(May 12, 2020)',
    },
    {
      name: 'Washington Post:',
      link: 'https://www.washingtonpost.com/news/powerpost/paloma/the-health-202/2020/05/05/the-health-202-social-distancing-hasn-t-been-as-effective-in-stemming-u-s-coronavirus-deaths-as-policymakers-had-hoped/5eb04b6d88e0fa594778ea5e/',
      text: "Social distancing hasn't been as effective in stemming U.S. coronavirus deaths as policymakers hoped",
      date: '(May 5, 2020)',
    },
    {
      name: 'New York Times:',
      link: 'https://www.nytimes.com/2020/04/10/nyregion/coronavirus-new-yorkers-leave.html',
      text: 'Did New Yorkers Who Fled to Second Homes Bring the Virus?',
      date: '(April 10, 2020)',
    },
    {
      name: 'Washington Post:',
      link: 'https://www.washingtonpost.com/politics/even-as-deaths-mount-officials-see-signs-pandemics-toll-may-not-match-worst-fears/2020/04/07/cb2d2290-78d1-11ea-9bee-c5bf9d2e3288_story.html',
      text: 'Even as deaths mount, officials see signs pandemic???s toll may not match worst fears',
      date: '(April 8, 2020)',
    },
    {
      name: 'Washington Post:',
      link: 'https://www.washingtonpost.com/politics/2020/04/08/leading-model-now-estimates-tens-thousands-fewer-covid-19-deaths-by-summer/',
      text: 'A leading model now estimates tens of thousands fewer covid-19 deaths by summer ',
      date: '(April 8, 2020)',
    },
    {
      name: 'CBS This Morning:',
      link: 'https://www.youtube.com/watch?v=uqGXzWCD9Xk',
      text: 'How the coronavirus is impacting rural areas',
      date: '(April 6, 2020)',
    },
    {
      name: 'ABC News:',
      link: 'https://www.youtube.com/watch?v=uqGXzWCD9Xk',
      text: 'How the coronavirus is impacting rural areas',
      date: '(April 6, 2020)',
    },
    {
      name: 'CBS This Morning:',
      link: 'https://abcnews.go.com/Health/surprising-covid-19-hot-spots-coronavirus-threatens-rural/story?id=69940146',
      text: 'Surprising COVID-19 hot spots: Why coronavirus still threatens rural areas',
      date: '(April 4, 2020)',
    },
    {
      name: 'Daily Mail:',
      link: 'https://www.dailymail.co.uk/news/article-8186581/Americas-hidden-hotspots-selfish-coronavirus-refugees-spread-disease.html',
      text: "America's hidden hotspots: Shocking maps reveal how rural areas and small communities are some of the hardest hit by coronavirus as hospitals are overwhelmed just like in New York and New Orleans",
      date: '(April 4, 2020)',
    },
    {
      name: 'The Root:',
      link: 'https://www.theroot.com/8-of-the-10-worst-coronavirus-hot-spots-are-in-the-sout-1842648491',
      text: '8 of the 10 Worst Coronavirus Hot Spots Are in the South. Apparently, Republican Governors Just Found Out About the Pandemic',
      date: '(April 3, 2020)',
    },
    {
      name: 'Scientific American:',
      link: 'https://www.scientificamerican.com/article/map-reveals-hidden-u-s-hotspots-of-coronavirus-infection/?fbclid=IwAR08weiTCQTmzeSd7harTwPDR7dgQEbUZYCr0CdJhEYJp4OK7ps9fgu7hgA',
      text: 'Map Reveals Hidden U.S. Hotspots of Coronavirus Infection',
      date: '(April 2, 2020)',
    },
    {
      name: 'Business Insider:',
      link: 'https://www.businessinsider.com/coronavirus-hotspot-in-the-us-south-states-covid-19-pandemic-2020-4',
      text: "New data reveals coronavirus hotspots brewing across the south, where the pandemic is set to 'hit hard'",
      date: '(April 2, 2020)',
    },
    {
      name: 'WGN:',
      link: 'https://wgntv.com/news/medical-watch/small-areas-hit-hard-by-covid-19-find-representation-in-u-of-c-map/',
      text: 'Small areas hit hard by COVID-19 find representation in U of C map',
      date: '(March 31, 2020)',
    },
    {
      name: 'Business Insider:',
      link: 'https://www.businessinsider.com/next-wave-of-coronavirus-national-epidemic-new-orleans-philadelphia-2020-3',
      text: 'The next wave of coronavirus outbreaks is threatening cities from New Orleans to Philadelphia, and it reveals the US is on pace for a national epidemic',
      date: '(March 30, 2020)',
    },
    {
      name: 'International Business Times:',
      link: 'https://www.ibtimes.com/coronavirus-usa-second-wave-outbreak-fall-possible-fauci-warns-2949741',
      text: 'Coronavirus USA: Second Wave Of Outbreak In Fall Possible, Fauci Warns',
      date: '(March 30, 2020)',
    },
    {
      name: 'Vox:',
      link: 'https://www.vox.com/2020/3/28/21197421/usa-coronavirus-covid-19-rural-america',
      text: 'The Coronavirus May Hit Rural America Later - and Harder',
      date: '(March 28, 2020)',
    },
    {
      name: 'UChicago News:',
      link: 'https://news.uchicago.edu/story/state-level-data-misses-growing-coronavirus-hot-spots-us-including-south',
      text: 'State-level data misses growing coronavirus hot spots in the U.S., including in the South',
      date: '(March 26, 2020)',
    },
  ],
  2021: [
    {
      name: 'Fast Company Innovation by Design:',
      link: 'https://www.fastcompany.com/90667101/pandemic-response-innovation-by-design-2021',
      text: "Pandemic Response category honoree for Fast Company's annual design awards",
      date: '(September 21, 2021)',
    },
    {
      name: 'USC Price Center for Social Innovation:',
      link: 'https://socialinnovation.usc.edu/wp-content/uploads/2021/10/RWJF-Report_FINAL_External.pdf',
      text: 'Designing Data Platforms for Action & Influence: Lessons Learned From a Case Study of Five Data Platforms',
      date: '(September 2021)',
    },
    {
      name: 'Robert Wood Johnson Foundation:',
      link: 'https://www.rwjf.org/en/library/collections/better-data-for-better-health.html',
      text: 'Better Data for Better Health: Data resources for analysis of the many factors that shape health in communities',
      date: '(May 19, 2021)',
    },
    {
      name: 'County Health Rankings & Roadmaps:',
      link: 'https://www.countyhealthrankings.org/news-events/tracking-covid-19-recently-updated-us-covid-atlas-offers-more-complete-picture-of-the-pandemic',
      text: 'Tracking COVID-19: Recently Updated US COVID Atlas Offers More Complete Picture of the Pandemic Experience',
      date: '(April 15, 2021)',
    },
    {
      name: 'STAT:',
      link: 'https://www.statnews.com/2021/03/31/integrate-social-determinants-time-place-public-health-maps/',
      text: 'Adding social determinants gives public health maps a sense of place and time',
      date: '(March 31, 2021)',
    },
    {
      name: 'MapBox:',
      link: 'https://www.mapbox.com/blog/notable-maps-visualizing-covid-19-and-surrounding-impacts-exploring-many-views-on-one-pandemic',
      text: 'Notable Maps Visualizing COVID-19 and Surrounding Impacts',
      date: '(February 5, 2021)',
    },
  ],
};

export default function Contact() {
  const [expanded, setExpanded] = useState('panelX');
  const url = `${process.env.REACT_APP_EMAIL_FORM_URL}`;

  const [formData, setFormData] = useState({
    Category: 'General',
    Contact_Name: '',
    Contact_Email: '',
    Contact_Phone: '_',
    Message: '',
  });

  const [formErrors, setFormErrors] = useState({
    Contact_Name: false,
    Contact_Email: false,
    Message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const message = urlParams.get('message');
    const id = urlParams.get('id');
    setFormData(prev => ({
      ...prev,
      Category: category || prev.Category,
      Message: id ? `Dear Atlas Staff, I'm writing to report harmful content in story \nBelow is a brief description of why this content is harmful: \n \n ### \n Do not edit below this line: \n Story Id: ${id} \n ###`: message || prev.Message,
    })
    )
  }, [])

  const generateURL = async (data, url) => {
    let returnURL = `${url}?Date=${encodeURIComponent(
      new Date().toISOString().slice(0, 10),
    )}`;
    for (const property in data) {
      returnURL += `&${encodeURIComponent(property)}=${encodeURIComponent(
        data[property],
      )}`;
    }
    return returnURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.Contact_Name === '' ||
      formData.Contact_Email === '' ||
      formData.Message === ''
    ) {
      if (formData.Contact_Name === '')
        setFormErrors((prev) => ({ ...prev, Contact_Name: true }));
      if (formData.Contact_Email === '')
        setFormErrors((prev) => ({ ...prev, Contact_Email: true }));
      if (formData.Message === '')
        setFormErrors((prev) => ({ ...prev, Message: true }));
    } else {
      setIsSubmitting(true);
      setFormErrors({
        Contact_Name: false,
        Contact_Email: false,
        Message: false,
      });

      const submissionURL = await generateURL(formData, url);
      await fetch(submissionURL, { method: 'GET' });

      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelect = (e) =>
    setFormData((prev) => ({ ...prev, Category: e.target.value }));
  return (
    <ContactPage>
      <NavBar light />
      <ContentContainer>
        <h1>Contact Us</h1>
        <a
          href="https://twitter.com/covid_atlas"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img
            src={`${process.env.PUBLIC_URL}/icons/twitter-icon-dark.png`}
            alt="Twitter Icon"
          />
        </a>
        <a
          href="https://github.com/GeoDaCenter/covid"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img
            src={`${process.env.PUBLIC_URL}/icons/github-icon-dark.png`}
            alt="Twitter Icon"
          />
        </a>
        <hr />
        <p>
          Contact US COVID Atlas co-leads directly if you have any questions
          about the Atlas or have media inquiries:
          <br />
        </p>
        {submitted && (
          <SuccessMessage>
            <p>
              Thanks for your message! Our team will review your message and get
              back with you as soon as possible. We appreciate your interest and
              helping us to improve the US Covid Atlas!
            </p>
            <button onClick={() => setSubmitted(false)}>??</button>
          </SuccessMessage>
        )}
        <ContactForm
          className={isSubmitting ? 'locked' : ''}
          onSubmit={handleSubmit}
        >
          <h2>CONTACT FORM</h2>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <InputBlock>
                <InputLabel id="Category">Message Type</InputLabel>
                <Select
                  labelId="Category-label"
                  id="Category"
                  value={formData['Category']}
                  onChange={handleSelect}
                >
                  <MenuItem value={'General'}>General</MenuItem>
                  <MenuItem value={'Bug'}>Bug Report or Error</MenuItem>
                  <MenuItem value={'DataQuestion'}>Data Question</MenuItem>
                  <MenuItem value={'FeatureRequest'}>Feature Request</MenuItem>
                  <MenuItem value={'HarmfulContent'}>Report Harmful Content</MenuItem>
                  <MenuItem value={'TechOpenSource'}>
                    Technical or Open Source Questions
                  </MenuItem>
                  <MenuItem value={'Press'}>Press or Media</MenuItem>
                </Select>
              </InputBlock>

              <InputBlock>
                <TextField
                  required
                  id="Contact_Name"
                  name="Contact_Name"
                  label="Name (Required)"
                  placeholder="Your Name"
                  onChange={handleChange}
                  error={formErrors['Contact_Name']}
                  helperText={
                    formErrors['Contact_Name'] && 'Please enter your name'
                  }
                />
              </InputBlock>

              <InputBlock>
                <TextField
                  required
                  id="Contact_Email"
                  type="email"
                  name="Contact_Email"
                  label="Email (Required)"
                  placeholder="greetings@you.com"
                  onChange={handleChange}
                  error={formErrors['Contact_Email']}
                  helperText={
                    formErrors['Contact_Email'] && 'Please enter your email'
                  }
                />
              </InputBlock>

              <InputBlock>
                <TextField
                  label="Phone (Optional)"
                  id="Contact_Phone"
                  type="tel"
                  name="Contact_Phone"
                  placeholder="111-876-5309"
                  onChange={handleChange}
                />
              </InputBlock>
            </Grid>
            <Grid item xs={12} md={8}>
              <InputBlock fullWidth={true}>
                <TextField
                sx={{
                  color:'black !important'
                }}
                  id="message"
                  label="Message"
                  multiline
                  rows={6}
                  placeholder="Your message..."
                  variant="outlined"
                  name="Message"
                  onChange={handleChange}
                  value={formData.Message}
                  error={formErrors['Message']}
                  helperText={formErrors['Message'] && 'Please enter a message'}
                />
              </InputBlock>
              <InputBlock>
                <button type="submit" id="submit-form">
                  Submit
                </button>
              </InputBlock>
            </Grid>
          </Grid>
        </ContactForm>
        <p>
          For additional inquiries, contact the US COVID Atlas team: Marynia
          Kolak (mkolak at uchicago.edu) or Qinyun Lin (qinyunlin at
          uchicago.edu)
        </p>
        <Gutter h={40} />
        <h2>NEWSLETTER</h2>
        <hr />
        <p>
          <a
            href="https://github.us10.list-manage.com/subscribe/post?u=5ed730d26727290870ec65153&id=74f209d5ed"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up for our newsletter
          </a>{' '}
          for semi-annual updates on innovative new features, fresh datasets,
          open source advances, and recent publications from the Atlas team.
        </p>
        <Gutter h={40} />
        <h2>CITATION</h2>
        <hr />
        <p>
          Li, Xun, Lin, Qinyun, and Kolak, Marynia. The U.S. COVID-19 Atlas,
          2020. https://www.uscovidatlas.org
          <br />
          <br />
          For a list of all contributors to the Atlas, please visit our{' '}
          <a href="/about#team">about</a> page.
        </p>
        <Gutter h={40} />
        {/* <h2>LEARNING COMMUNITY</h2>
                <hr/>
                <p>
                    The <a href="https://covidatlas.healthcarecommunities.org/" target="_blank" rel="noopener noreferrer">Atlas Learning Community</a> is project by <a href="https://www.spreadinnovation.com/" target="_blank" rel="noopener noreferrer">CSI Solutions</a> to provide Atlas super-users, health practioners, and planners a place to interact. 
                    It is moderated by coalition members. Ask questions, provide feedback, and help make the Atlas Coalition stronger!
                </p>
                <Gutter h={40}/> */}
        <h2>MEDIA COVERAGE</h2>
        <hr />
        {['2021', '2020'].map((year, index) => (
          <Accordion
            square
            expanded={expanded === `panel${index}`}
            onChange={() =>
              setExpanded((prev) =>
                prev === `panel${index}` ? 'panelX' : `panel${index}`,
              )
            }
          >
            <AccordionSummary
              aria-controls={`panel${index}d-content`}
              id={`panel${index}d-header`}
            >
              <h2>
                <b>{year}</b>
              </h2>
            </AccordionSummary>
            <AccordionDetails>
              {press[year].map((press) => (
                <p>
                  <b>{press.name} </b>
                  <a
                    href={press.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {press.text}{' '}
                  </a>
                  {press.date}
                  <br />
                  <br />
                </p>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </ContentContainer>
      <Footer signUp={true} />
    </ContactPage>
  );
}
