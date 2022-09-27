import React, { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import CircularProgress from '@mui/material/CircularProgress';
import useMapData from "../../../../hooks/useMapData";
import useGetReportViewport from "../../../../hooks/useGetReportViewport";
import {
  ControlPopover,
  LegendInner,
  MapSection,
} from "../../../../components";
import {
  PanelItemContainer,
  GrabTarget,
  DeleteBlock,
  // widthOptions,
  // heightOptions,
} from "./PageComponentsLayout";
import { findIn } from "../../../../utils";
import colors from "../../../../config/colors";
import countyNames from "../../../../meta/countyNames";
import { colorScales } from "../../../../config/scales";
import { defaultData } from "../../../../config/defaults";
import { Box } from "@mui/material";
import { HoverButtonsContainer } from "../InterfaceComponents/HoverButtonsContainer";
import { paramsSelectors } from "../../../../stores/paramsStore";
import { reportSelectors } from '../../../../stores/reportStore'
const { selectPrintStatus } = reportSelectors;
const { selectDates, selectVariableTree, selectVariables } = paramsSelectors;

const defaultMapParams = {
  mapType: "natural_breaks",
  bins: {
    bins: [],
    breaks: [],
  },
  binMode: "",
  fixedScale: null,
  nBins: 8,
  vizType: "2D",
  activeGeoid: "",
  overlay: "",
  resource: "",
  dotDensityParams: {
    raceCodes: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: false,
      6: false,
      7: false,
      8: true,
    },
    colorCOVID: false,
    backgroundTransparency: 0.01,
  },
};

const MapTitle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 500;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  padding: 0.25rem 0.5rem;
  font-size:1rem;
`;
const MapAttribution = styled(MapTitle)`
  left:initial;
  top: initial;
  right:0;
  bottom:0;
  width:auto;
  font-size:0.65rem;
`
export const NoInteractionGate = ({ children, style }) => (
  <div style={{ pointerEvents: "none !important", userSelect: 'none !importabnt', width: "100%", height: "100%", ...style }}>
    {children}
  </div>
);

const getColorScale = (mapType, dataParams) => {
  switch (mapType) {
    case "natural_breaks":
      return colorScales[dataParams.colorScale] || colorScales.natural_breaks;
    case "hinge15_breaks":
      return colorScales.hinge15_breaks;
    case "lisa":
      return colorScales.lisa;
    default:
      return [];
  }
};

function ReportMap({
  geoid = 17031,
  pageIdx = 0,
  itemId = '',
  handleChange,
  handleRemove,
  date,
  dateIndex,
  reportName = '',
  variable = "Percent Fully Vaccinated",
  mapType = "natural_breaks",
  scale = "county",
  loadedCallback = () => { },
}) {
  const dates = useSelector(selectDates);
  const isPrinting = useSelector(selectPrintStatus);
  const variableTree = useSelector(selectVariableTree);
  const variables = useSelector(selectVariables);

  const variableList = Object.keys(variableTree)
    .filter((f) => !f.includes("HEADER"))
    .map((f) => ({ label: f, value: f }));

  const dataParams = {
    ...(findIn(variables, "variableName", variable) || {}),
    nIndex: dateIndex,
  };

  const mapParams = {
    ...defaultMapParams,
    mapType,
    binMode: "dynamic",
    colorScale: getColorScale(mapType, dataParams),
  };

  const mapContainerRef = useRef(null);
  const { width: mapWidth, height: mapHeight } =
    mapContainerRef?.current?.getBoundingClientRect() || {};

  const currentData = defaultData
  const mapIdCol = "GEOID";

  const [
    currentMapGeography,
    currentMapData,
    ,// { cartogramData, cartogramCenter, cartogramDataSnapshot },
    currentMapID,
    currentBins,
    currentHeightScale,
    isLoading,
    geojsonData,
    currIndex,
    isBackgroundLoading,
  ] = useMapData({
    dataParams,
    mapParams,
    currentData,
  });

  const onLoad = isPrinting ? () => {
    setTimeout(() => {
      loadedCallback(!isLoading);
    }, 2500)
  } : () => {
    loadedCallback(!isLoading);
  }

  const [
    countyViewport,
    neighborsViewport,
    secondOrderNeighborsViewport,
    stateViewport,
    nationalViewport
    // neighbors,
    // secondOrderNeighbors,
    // stateNeighbors,
  ] = useGetReportViewport({
    geoid,
    currentData,
    geojsonData,
    mapIdCol,
    mapWidth,
    mapHeight,
  });

  const currViewport = {
    county: countyViewport,
    neighbors: neighborsViewport,
    region: secondOrderNeighborsViewport,
    state: stateViewport,
    national: nationalViewport
  }[scale];

  const mapInner = useMemo(
    () => {
      if (isLoading || isBackgroundLoading) {
        return null
      } else {

        return <NoInteractionGate>
          <MapSection
            currentMapGeography={currentMapGeography}
            currentMapData={currentMapData}
            currentMapID={currentMapID}
            currentHeightScale={currentHeightScale}
            isLoading={isLoading}
            mapParams={mapParams}
            currentData={currentData}
            currIdCol={mapIdCol}
            theme={"light"}
            manualViewport={currViewport}
            hoverGeoid={geoid}
            highlightGeoids={[geoid]}
            onLoad={onLoad}
          />
        </NoInteractionGate>
      }
    },
    [isLoading, isBackgroundLoading, JSON.stringify(currViewport), currentMapID]
  );

  return (
    <PanelItemContainer ref={mapContainerRef}>
      {!!(isLoading || isBackgroundLoading) ? (
        <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '3em', height: '3em' }}>
          <CircularProgress />
        </Box>
      ) : (<>
        <MapTitle>
          <h4>{dataParams.variableName}</h4>
          <LegendInner
            colorScale={mapParams.colorScale}
            currentBins={currentBins?.bins || []}
            fixedScale={dataParams.fixedScale}
          />
        </MapTitle>
        <MapAttribution>
          Source: New York Times via US Covid Atlas :: Date: {dates[currIndex]}
        </MapAttribution>
        {mapInner}
      </>
      )}
      <HoverButtonsContainer>
        <ControlPopover
          className="hover-buttons"
          inline
          size={4}
          iconColor={colors.strongOrange}
          controlElements={[
            {
              type: "header",
              content: "Controls for Text Report Block",
            },
            {
              type: "helperText",
              content: "Select the data to display on the chart.",
            },
            {
              type: "comboBox",
              content: {
                label: "Search County",
                items: countyNames,
              },
              action: ({ value }) =>
                handleChange({ geoid: value }),
              value: geoid,
            },
            {
              type: "select",
              content: {
                label: "Change Variable",
                items: variableList,
              },
              action: (e) =>
                handleChange({ variable: e.target.value }),
            },
            {
              type: "select",
              content: {
                label: "Change Map Type",
                items: [{
                  label: "Natural Breaks",
                  value: "natural_breaks",
                }, {
                  label: "Box Map",
                  value: "hinge15_breaks",
                }, {
                  label: "Hotspot",
                  value: "lisa",
                }],
              },
              action: (e) =>
                handleChange({ mapType: e.target.value }),
            },
            {
              type: "select",
              content: {
                label: "Change View Scale",
                items: [
                  {
                    value: "county",
                    label: "County",
                  },
                  {
                    value: "neighbors",
                    label: "Neighboring Counties",
                  },
                  {
                    value: "region",
                    label: "Region",
                  },
                  {
                    value: "state",
                    label: "State",
                  },
                  {
                    value: "national",
                    label: "National (Lower 48)",
                  },
                ],
              },
              action: (e) =>
                handleChange({ scale: e.target.value }),
            }
          ]}
        />
        <GrabTarget iconColor={colors.strongOrange} className="hover-buttons" />

        <DeleteBlock
          iconColor={colors.strongOrange}
          className="hover-buttons"
          onClick={() => handleRemove(pageIdx, itemId)}
        />
      </HoverButtonsContainer>
    </PanelItemContainer>
  );
}

export default React.memo(ReportMap);
