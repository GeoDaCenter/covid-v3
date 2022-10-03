import React, { useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "@mui/material";
import {
  ControlPopover,
  Draggable,
  Scaleable,
  Icon,
  LineChartInner
} from "../../components";
import colors from "../../config/colors";
import { getDefaultDimensions } from "../../utils/getDefaultDimensions";

const ChartContainerOuter = styled.div`
  span {
    color: white;
  }
  user-select: none;
  /* flex: 1 0 auto; */
  position: absolute;
  display:block;
  width: 100%;
  height: 100%;
  z-index: 0;
  @media (max-width: 600px) {
    position:fixed;
    z-index: 50000;
    top:10em;
    left:0;
    width:100%;
    height:calc(100% - 10em);
    background:${colors.gray};
  }
`;

const PopOutContainer = styled.div`
  position: relative;
  background: ${colors.gray};
  padding: 0;
`;
const DockPopButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 2em;
  height: 2em;
  background: none;
  border: none;
  padding: 0.25em;
  z-index: 1;
  cursor: pointer;
  svg g {
    fill: ${colors.yellow};
  }
  @media (max-width:600px){
    display:none;
  }
`;

/**
 * Component to wrap chat and provide controls
 * @component
 * @example
 * <LineChart defaultDimensions={{defaultDimensions}} />
 * 
 * See src/utils/getDefaultDimensions.js for defaultDimensions
 */
export default function LineChartOuter({ defaultDimensions=getDefaultDimensions() }) {
  const [isPoppedOut, setIsPoppedOut] = useState(true);
  const [table, setTable] = useState("cases");
  const [logChart, setLogChart] = useState(false);
  const [showSummarized, setShowSummarized] = useState(true);
  const [populationNormalized, setPopulationNormalized] = useState(false);
  const [shouldShowVariants, setShouldShowVariants] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  console.log(table)
  const handleSwitch = () => setLogChart((prev) => !prev);
  const handlePopSwitch = () => setPopulationNormalized((prev) => !prev);
  const handleSummarizedSwitch = () => setShowSummarized((prev) => !prev);
  const handleShouldShowVariants = () => setShouldShowVariants((prev) => !prev);

  const ChartContent =
    <ChartContainerOuter>
      <ControlPopover
        bottom
        left
        controlElements={[
          {
            type: "header",
            content: "Line Chart Controls",
          },
          {
            type: "helperText",
            content: "Select the data to display on the chart.",
          },
          {
            type: "select",
            content: {
              label: "Line Chart Variable",
              items: [
                {
                  text: "Cases",
                  value: "cases",
                },
                {
                  text: "Deaths",
                  value: "deaths",
                },
                {
                  text: "Fully Vaccinated Persons",
                  value: "vaccines_fully_vaccinated",
                },
                // {
                //   text: "Weekly Positivity",
                //   value: "testing_wk_pos",
                // },
              ],
            },
            action: (e) => setTable(e.target.value),
            value: table,
          },
          {
            type: "switch",
            content: "Logarithmic Scale",
            action: handleSwitch,
            value: logChart,
          },
          {
            type: "switch",
            content: "Population Normalization",
            action: handlePopSwitch,
            value: populationNormalized,
          },
          {
            type: "switch",
            content: "Show Summary Line",
            action: handleSummarizedSwitch,
            value: showSummarized,
          },
          {
            type: "switch",
            content: "Variant Designations",
            action: handleShouldShowVariants,
            value: shouldShowVariants,
          },
        ]}
      />
      <LineChartInner
        resetDock={() => setIsPoppedOut(false)}
        {...{
          table,
          logChart,
          showSummarized,
          populationNormalized,
          shouldShowVariants,
        }}
      />
    </ChartContainerOuter>

  if (isMobile) {
    return ChartContent
  }
  return isPoppedOut ? (
    <Draggable
      z={9}
      defaultX={window.innerWidth - defaultDimensions.defaultWidthLong}
      defaultY={50}
      title="lineChart"
      allowCollapse={false}
    >
      <Scaleable
        title="lineChart"
        defaultWidth={defaultDimensions.defaultWidthLong}
        defaultHeight={defaultDimensions.defaultHeight}
        minHeight={defaultDimensions.minHeight}
        minWidth={defaultDimensions.minWidth}
      >
        {ChartContent}
      </Scaleable>
    </Draggable>
  ) : (
    <PopOutContainer
      style={{
        height: defaultDimensions.defaultHeight + "px",
        minHeight: defaultDimensions.defaultHeight + "px",
        width: defaultDimensions.defaultWidthLong + "px",
      }}
    >
      <DockPopButton
        title="Popout Line Chart Panel"
        onClick={() => setIsPoppedOut(true)}
        className="popout-button"
      >
        <Icon symbol="popOut" />
      </DockPopButton>

      <ControlPopover
        bottom
        left
        controlElements={[
          {
            type: "header",
            content: "Line Chart Controls",
          },
          {
            type: "helperText",
            content: "Select the data to display on the chart.",
          },
          {
            type: "select",
            content: {
              label: "Line Chart Variable",
              items: [
                {
                  text: "Cases",
                  value: "cases",
                },
                {
                  text: "Deaths",
                  value: "deaths",
                },
                {
                  text: "Fully Vaccinated Persons",
                  value: "vaccines_fully_vaccinated",
                },
                // {
                //   text: "Weekly Positivity",
                //   value: "testing_wk_pos",
                // },
              ],
            },
            action: (e) => setTable(e.target.value),
            value: table,
          },
          {
            type: "switch",
            content: "Logarithmic Scale",
            action: handleSwitch,
            value: logChart,
          },
          {
            type: "switch",
            content: "Population Normalization",
            action: handlePopSwitch,
            value: populationNormalized,
          },
          {
            type: "switch",
            content: "Show Summary Line",
            action: handleSummarizedSwitch,
            value: showSummarized,
          },
          {
            type: "switch",
            content: "Variant Designations",
            action: handleShouldShowVariants,
            value: shouldShowVariants,
          },
        ]}
      />
      <LineChartInner
        docked={true}
        {...{
          table,
          logChart,
          showSummarized,
          populationNormalized,
          shouldShowVariants,
        }}
      />
    </PopOutContainer>
  );
}