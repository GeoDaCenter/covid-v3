import styled from 'styled-components';
import colors from '../../config/colors';

// div container for tooltip, see MapTooltipContent
export const HoverDiv = styled.div`
  background: ${colors.gray};
  border:1px solid ${colors.darkgray};
  color: white;
  z-index:500000;
  h3 {
    margin: 5px 0;
  }
  hr {
    margin: 5px 0;
  }
  max-width: 300px;
  line-height: 1.25;
  @media (max-width: 600px) {
    max-width:20ch !important;
  }
    `;
