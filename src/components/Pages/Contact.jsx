import React from 'react';
import styled from 'styled-components';
import { NavBar, Footer, ContentContainer, Gutter } from '../../components';
import ContactForm from '../Interface/ContactForm';

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

export default function Contact() {
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
        <ContactForm />
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
        Marynia Kolak, Qinyun Lin, Dylan Halpern, Susan Paykin, Aresha Martinez-Cardoso, and Xun Li. The US Covid Atlas, 2022. Center for Spatial Data Science at University of Chicago. https://www.uscovidatlas.org
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
