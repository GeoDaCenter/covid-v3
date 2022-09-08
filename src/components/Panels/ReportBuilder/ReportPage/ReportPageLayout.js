import { Button } from "@mui/material";
import styled from "styled-components";
import colors from "../../../../config/colors";

const pagePadding = 2;

export const LayoutPageContainer = styled.div`
  background: white;
  border: 1px solid black;
  width: 80em;
  height:100em;
  margin: 0.25em auto;
  position: relative;
  color: black;
  padding: ${pagePadding}em;  
  @media print {
    overflow-y: visible;
    page-break-after: always;
  }
  transform:scale(${({pageWidth, zoomMultiplier}) => (zoomMultiplier||1)*(pageWidth||0)/1100});
  transform-origin: 50% 0;
  transition:250ms transform;
  .react-grid-item > .react-resizable-handle {
    width:1em;
    height:1em;
    font-weight:bold;
    position:absolute;
    right:0;
    bottom:.5em;
    z-index:50000000;
  }
  .react-grid-item > .react-resizable-handle:after {
    border-right-color: rgba(255, 255, 255, 0.5);
    border-bottom-color: rgba(255, 255, 255, 0.5);
    content:'↘';
  }
  
  .react-grid-placeholder {
    background:rgba(255,255,0,0.1);
    transition:250ms all;
    .react-resizable-handle {
      display:none;
    }
  }
`;

export const AddItemButton = styled(Button)`
  background: ${colors.yellow};
  position: absolute;
  right: 1em;
  bottom: 1em;
  height: 4em;
  width: 4em;
  padding: .25em .5em;
  color: black;
  font-size:1rem;
  border-radius:50%;
  box-shadow: 0 0 5px 2px ${colors.darkgray};
  cursor: pointer;
  svg {
    width:2rem;
    height:2rem;
  }
`;

const WaterMarkDiv = styled.div`
  position: absolute;
  left: ${(props) => (props.left ? pagePadding + "em" : "initial")};
  right: ${(props) => (props.right ? pagePadding + "em" : "initial")};
  top: ${(props) => (props.top ? pagePadding + "em" : "initial")};
  bottom: ${(props) => (props.bottom ? pagePadding + "em" : "initial")};
  p {
    font-size: 0.5rem;
  }
  max-width: 35%;
  img {
    width: 50%;
  }
`;

const AttributionDiv = styled.div`
  position:absolute;
  left:50%;
  bottom:${pagePadding}em;
  transform:translateX(-50%);
  text-align:center;
  h5 {
    margin:0 0 .5em 0;
    padding:0;
    line-height:1;
  }
`

export const DateWaterMark = () => (
  <WaterMarkDiv left bottom>
    <p>
      Data from USA Facts, CDC, Census ACS. Map Data (c) OpenStreetMap Contributors, Mapbox.
      Generated on {new Date().toISOString().slice(0,10)}
    </p>
  </WaterMarkDiv>
);

export const AtlasWaterMark = () => (
  <WaterMarkDiv right bottom>
    <img
      src={`${process.env.PUBLIC_URL}/img/us-covid-atlas-cluster-logo.svg`}
      style={{ width: "100%" }}
      alt=""
    />
  </WaterMarkDiv>
);

export const Attribution = () => <AttributionDiv>
  <h5>uscovidatlas.org &#8193; @uscovidatlas</h5>
  </AttributionDiv>