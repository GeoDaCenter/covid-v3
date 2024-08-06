import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import colors from '../../config/colors';

const FooterContainer = styled.footer`
  width: 100%;
  background: ${colors.teal};
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 49px;
    font-weight: 300;
    text-align: left;
    font-style: italic;
    color: #d8d8d8;
    width: 80vw;
    max-width: 940px;
    margin: 0;
    font-size: 4rem;
    @media (max-width: 960px) {
      font-size: 2rem;
      width: 100%;
    }
  }
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
  p {
    color: ${colors.lightgray};
    font-size: 1rem;
  }
  h6 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: ${colors.white};
  }
  a {
    text-decoration: none;
    color: ${colors.skyblue};
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  img {
    margin-bottom: 10px;
    @media (max-width: 960px) {
      max-width: 50%;
      display: block;
      margin: 40px auto;
    }
  }
  hr.footerHr {
    margin: 20px 0;
  }
`;
const FooterContent = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
`;

const LinkLists = styled(Grid)`
  width: 100%;
  padding: 50px;
  ul {
    list-style: none;
    li {
      line-height: 1.5;
    }
  }
  p.copyright {
    font-size: 0.9rem;
    color: ${colors.lightgray};
  }
  @media (max-width: 960px) {
    text-align: center;
  }
`;

const SignupForm = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  h1.signup {
    width: 100%;
    font-size: 2rem;
    text-align: center;
  }
  h2 {
    color: ${colors.lightgray};
    font-size: 1.25rem;
    font-weight: 200;
  }
  form {
    max-width: 600px;
    margin: 0 auto;
  }
  .MuiOutlinedInput-root {
    display: inline-block;
    background: white;
    width: 100%;
  }
  a {
    display: inline-block;
    background-color: ${colors.orange};
    color: #0d0d0d;
    border: none;
    outline: none;
    border-radius: 5px;
    font-size: 1.25rem;
    text-transform: uppercase;
    padding: 0.25em 0.5em;
    margin: 0.5em 0 0 0;
    font-weight: bold;
    font-family: 'Lato', sans-serif;
  }
  .sr-only {
    visibility: hidden;
  }
`;
/**
 * Footer component, nothing fancy here.
 * 
 * @component
 * @category Components/Layout
 * 
 * @param {boolean} signUp - if true, show the signup form 
 * @returns {JSX.Element} - Footer component
 */
const Footer = ({
  signUp
}) => {
  return (
    <FooterContainer>
      <FooterContent>
        {signUp && (
          <SignupForm>
            <h1 className="signup">Sign up for the Newsletter</h1>
            <h2>
              We'll keep you up to date with new updates, features, and insights
              on the COVID-19 pandemic. Follow the US COVID Atlas team on Medium
              too.
            </h2>

            <a
              href="https://uscovidatlas.us21.list-manage.com/subscribe/post?u=82f536192f2f5d3558022d9d0&amp;id=c309850f2d&amp;f_id=00b9f6e1f0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe
            </a>
          </SignupForm>
        )}

        {signUp && <hr className="footerHr" />}
        <LinkLists container spacing={1}>
          <Grid item xs={6} md={3}>
            <span>
              <h6>Explore</h6>
              <ul>
                <li>
                  <NavLink to="/map">The Atlas</NavLink>
                </li>
                <li>
                  <NavLink to="/data">Data</NavLink>
                </li>
                <li>
                  <NavLink to="/methods">Methods</NavLink>
                </li>
                <li>
                  <NavLink to="/learn">Learn Toolkit</NavLink>
                </li>
                <li>
                  <NavLink to="/archive">Stories</NavLink>
                </li>
              </ul>
            </span>
          </Grid>
          <Grid item xs={6} md={4}>
            <span>
              <h6>About</h6>
              <ul>
                <li>
                  <NavLink to="/about">Our Team</NavLink>
                </li>
                <li>
                  <NavLink to="/contact">Contact Us</NavLink>
                </li>
                <li>
                  <NavLink to="/conduct">Code of Conduct</NavLink>
                </li>
                <li>
                  <NavLink to="/privacy">Privacy Policy</NavLink>
                </li>
              </ul>
            </span>
          </Grid>
          <Grid item xs={12} md={5}>
            {/* <img
              src={`${process.env.PUBLIC_URL}/img/csds-university-wordmark-white.png`}
              width="100%;"
              alt="Center for Spatial Data Science logo"
            /> */}
            <p className="copyright">
              {/* Brought to you by the Center for Spatial Data Science{' '}
              <a
                href="https://spatial.uchicago.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @UChicago
              </a> */}
              The Atlas is led by the {' '}
              <a
                href="http://healthyregions.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Healthy Regions &amp; Policies Lab  
              </a>
               , at the University of Illinois at Urbana, and the University of Chicago. Funded in part by the{' '}
              <a
                href="https://www.rwjf.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Robert Wood Johnson Foundation
              </a>
              .
            </p>
            <br />
            <p className="copyright">

                Powered by               <a
                href="http://netlify.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Netlify
              </a>
              .
                Map driven by {' '}
              <a
                href="https://geodacenter.github.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GeoDa
              </a>.

            </p>
          </Grid>
        </LinkLists>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
