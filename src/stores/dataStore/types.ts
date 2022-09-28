export type DateIndex = number
export type GEOID = number
export type DataRow = { [key: DateIndex]: number | string }
export type YYYYMM = 'latest' | `202${number}-${number}${number}`

export interface Dataset {
    // list of loaded dates, in YYYY-MM format
    loaded: YYYYMM[]
    // indices of loaded dates, starting at January 21st, 2020
    dates: DateIndex[]
    // each geography, as a key, with a set of rows, each row being a date
    data: { [key: GEOID]: DataRow }
}

export interface WeightSpec {
    // JS geoda weights returns
    isValid: boolean
    // weight ID
    uid: string
    // matches map ID
    mapUid: string
    // internal jsgeoda - not used
    weightType: number
    // internal jsgeoda - not used
    isSymmetric: boolean
    numObs: number
    sparsity: number
    maxNeighbors: number
    minNeighbors: number
    meanNeighbors: number
    medianNeighbors: number
}

export interface GeojsonDataset {
    // the geojson data
    data: GeoJSON.FeatureCollection
    // mapID for use in jsgeoda
    mapId: string
    // common join column
    joinCol: string
    // extracted geojson properties
    properties: { [key: GEOID]: any }
    // jsgeoda requires features to ORDERED not just keyed
    // so, for doing spatial analysis with dictionaries/objects, we need to keep the order the same
    // these two dictionaries are mirrored, but quickly help order data when looping through 3k rows
    order: {
        // keyed by GEOID, the index of the feature in the feature collection
        geoidOrder: { [key: GEOID]: number }
        // keyed by index, the GEOID of the feature in the feature collection
        indexOrder: { [key: number]: GEOID }
    }
    weights: WeightSpec | {}
}
export type DotDensityDatashape = [raceCode: number, x: number, y: number, GEOID: GEOID][]

export interface DataState {
    storedData: { [key: string]: Partial<Dataset> }
    storedGeojson: { [key: string]: Partial<GeojsonDataset> }
    // custom PBF schema for dot density
    // X and Y values are multiplied
    dotDensityData: DotDensityDatashape
    isTicking: boolean
    canLoadInBackground: boolean
}
