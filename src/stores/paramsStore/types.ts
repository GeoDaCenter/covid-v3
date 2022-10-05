type Geographies = 'County' | 'State' | string

interface TableSpec {
  name: string
  geography: Geographies
  table: string
  fileType: 'pbf' | 'csv' | string | null
  dataType: 'time-series-cumulative' | 'characteristic' | 'time-series' | string
  join: null | string
  default: null | 1
  id: string
  date?: 'isoDateList' | 'usDateList'
  deprecated?: null | 1
}

export interface DatasetSpec {
  name: string
  file: string
  join: 'GEOID' | 'FIPS' | string
  geography: Geographies
  deprecated?: null | 1
  tables?: { cases?: string; deaths?: string }
  isCustom?: boolean
}

export interface VariableSpec {
  variableName: string
  numerator: string
  nType: string
  nIndex: string
  nRange: null | number
  nProperty: null | string
  denominator: string
  dType: null | string
  dProperty: null | string
  dRange: null | number
  dIndex: null | number
  scale: null | number
  scale3D: null | number
  fixedScale: null | string
  colorScale: null | string
  separateZero: null | 1
  dataNote: null | string
  customData?: string
  rangeType?: 'custom' | null
}

interface VariableTree {
  [key: string]: {
    County?: string[]
    State?: string[]
    deprecated?: 1 | null
  }
}

export interface MapParamsSpec {
mapType: 'natural_breaks' | 'hinge15_breaks' | 'lisa' | string
bins: {
  bins: number[]
  breaks: number[]
}
binMode: 'dynamic' | '' | null
fixedScale: null | 'string'
nBins: number
vizType: '2D' | '3D' | 'dotDensity' | 'cartogram' | string
activeGeoid: string | '' | null
overlay: string
resource: string
colorScale: [number, number, number][] | [number, number, number, number][]
  dotDensityParams: {
    raceCodes: {
      [key: number]: boolean
    }
    colorCOVID: boolean
    backgroundTransparency: number
  }
}

export interface ParamsUiState {
  // parameters for app
  // Default data state
  // current geojson
  currentData: string
  // use geojson properties, or external table spec
  currentTable: {
    numerator: 'properties' | TableSpec
    denominator: 'properties' | TableSpec
  }
  // list of available geojsons
  datasets: DatasetSpec[]
  // list of available dates
  dates: string[]
  // list of table specs
  tables: TableSpec[]
  // list of variables
  variables: VariableSpec[]
  // geographies available by variable / dataset
  variableTree: VariableTree
  // for parsing url params, dataset names and geographies
  urlParamsTree: {
    [key: string]: {
      name: string
      geography: Geographies
    }
  }
  // current data params for the map
  dataParams: VariableSpec
  // stored range for when returning to timeseries dataset from non-timeseries
  storedRange: null | number
  // stored index for when returning to timeseries dataset from non-timeseries
  storedIndex: null | number
  // current map visualization params
  mapParams: MapParamsSpec
  // interactive chart params
  chartParams: {
    table: string
    populationNormalized: boolean
  }
  // list of GEOIDs/IDs
  selectionKeys: number[]
  // list of names for GEOIDs/IDs
  selectionNames: string[]
  //#### UI ####
  // Ancor element for tooltip popper
  anchorEl: null | React.RefObject<HTMLElement>
  // animation is playing
  isPlaying: boolean
  // map is loaded
  mapLoaded: boolean
  // notification text and location
  // see src/components/Layout/NotificationBox
  notification: {
    info: null | string
    location: string
  }
  // panels are open, closed
  // context menu (not currently used)
  // and context XY
  panelState: {
    [key: string]: boolean
  }
  // tooltip information, xy screen position
  tooltipInfo: {
    x: number
    y: number
    data: null | { [key: string]: any }
    geoid: null | number
  }
  // map should trigger update
  shouldUpdate: boolean
  // data is loading
  isLoading: boolean
  // map screenshot data for print. deprecated
  mapScreenshotData: Object
  // map should pan to new location indiciator
  shouldPanMap: boolean
  // filter map values
  colorFilter: boolean | number[]
  // left hand size menu width for tooltip offsets
  variableMenuWidth: number
}
