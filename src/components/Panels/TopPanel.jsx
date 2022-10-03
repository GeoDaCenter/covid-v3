// this components houses the slider, legend, and bottom dock chart
import React from 'react';
import styled from 'styled-components';
import { DateSlider } from '..';
import colors from '../../config/colors';

// Styled components
const TopDrawer = styled.div`
  position: absolute;
  top: 0;
  left: calc(50vw);
  transform:translateX(-50%);
  background: ${colors.gray};
  width: 40vw;
  max-width: 900px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border: 1px solid ${colors.black};
  border-top:none;
  border-radius: 0;
  transition: 250ms all;
  /* z-index:6; */
  hr {
    opacity: 0.5;
  }
  div.MuiGrid-item {
    padding: 0;
  }

  @media (max-width: 1440px) {
    width: 30vw;
  }
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    left: 0;
    transform: none;
    top:6em;
    border-top: 2px solid ${colors.darkgray};
  }
  @media (max-width: 750px) and (orientation: landscape) {
    // bottom all the way down for landscape phone
  }
`;

/**
 * Container component for Date slider, play button, etc. on the top.
 * @component
 * @category Components/Map
 */
function TopPanel(){
  return (
    <TopDrawer id="timelinePanel">
      <DateSlider />
    </TopDrawer>
  );
};
export default  TopPanel;