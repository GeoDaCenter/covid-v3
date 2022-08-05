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
          href="https://github.com/GeoDaCenter/covid-v3"
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
            <button onClick={() => setSubmitted(false)}>×</button>
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
      </ContentContainer>
      <Footer signUp={true} />
    </ContactPage>
  );
}
