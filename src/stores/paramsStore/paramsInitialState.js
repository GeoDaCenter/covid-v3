import {
  variableTree,
  urlParamsTree,
} from "../../config/index";

import {
  defaultData,
} from "../../config/defaults";

import variables from "../../config/variables";
import tables from "../../config/tables";
import datasets from "../../config/datasets";

const INITIAL_STATE = {
  // parameters for app
  // Default data state
  currentData: defaultData,
  currentTable: {
    numerator: "cases",
    denominator: "properties",
  },
  // defaults
  datasets,
  dates: [],
  tables,
  variables,
  variableTree,
  urlParamsTree,
  urlParams: {},
  // params
  dataParams: {
    variableName: "Confirmed Count per 100K Population",
    numerator: "cases",
    nType: "time-series",
    nRange: 7,
    nProperty: null,
    nIndex: null,
    denominator: "properties",
    dType: "characteristic",
    dProperty: "population",
    dRange: null,
    dIndex: null,
    scale: 100000,
    scale3D: 1000,
    fixedScale: null,
    colorScale: null,
    dataNote: null,
    zAxisParams: null,
    storedRange: null,
    ...variables.find(variable => variable.variableName === "Confirmed Count per 100K Population")
  },
  storedRange: null,
  mapParams: {
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
    colorScale: [
      [255, 255, 204],
      [255, 237, 160],
      [254, 217, 118],
      [254, 178, 76],
      [253, 141, 60],
      [252, 78, 42],
      [227, 26, 28],
      [177, 0, 38],
    ],
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
  },
  chartParams: {
    table: "cases",
    populationNormalized: false,
  },  
  selectionKeys: [],
  selectionNames: [],
  // UI
  anchorEl: null,
  isPlaying: false,
  mapLoaded: false,
  notification: {
    info: null,
    location: "",
  },
  panelState: {
    variables: true,
    info: false,
    tutorial: false,
    lineChart: true,
    context: false,
    contextPos: { x: null, y: null },
    dataLoader: false,
    scatterChart: false,
    reportBuilder: false,
    storiesPane: false
  },
  tooltipInfo: {
    x: 0,
    y: 0,
    data: null,
    geoid: null
  },
  shouldUpdate: true,
  isLoading: true,
  mapScreenshotData: {},
  shouldPanMap: false,
  colorFilter: false,
  variableMenuWidth: 0
}

export default INITIAL_STATE;