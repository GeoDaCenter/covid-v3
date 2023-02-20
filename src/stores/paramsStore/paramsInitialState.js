import { urlParamsTree } from '../../config/index'

import { defaultData } from '../../config/defaults'

import variables from '../../config/variables'
import variableTree from '../../config/variableTree'
import tables from '../../config/tables'
import datasets from '../../config/datasets'

const defaultNumeratorId = datasets.find((f) => f.file === defaultData)?.tables
    ?.cases
const defaultNumeratorTable = tables.find((f) => f.id === defaultNumeratorId)
const INITIAL_STATE = {
    // parameters for app
    // Default data state
    currentData: defaultData,
    currentTable: {
        numerator: defaultNumeratorTable || 'vaccines_fully_vaccinated',
        denominator: 'properties',
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
        variableName: 'Percent Fully Vaccinated', //'Confirmed Count per 100K Population',
        numerator: 'vaccines_fully_vaccinated',//cases',
        nType: 'time-series',
        nRange: null,
        nProperty: null,
        nIndex: null,
        denominator: 'properties',
        dType: 'characteristic',
        dProperty: 'population',
        dRange: null,
        dIndex: null,
        scale: 100, // 100000 for confirmed cases/100k
        scale3D: 500000, //1000 for confirmed cases / 100k
        fixedScale: null,
        colorScale: 'YlGn8',
        dataNote: 'Hawaii vaccination data are state only.',
        zAxisParams: null,
        storedRange: null,
        ...variables.find(
            (variable) =>
                variable.variableName === 'Percent Fully Vaccinated'
        ),
    },
    storedRange: null,
    mapParams: {
        mapType: 'natural_breaks',
        bins: {
            bins: [],
            breaks: [],
        },
        binMode: '',
        fixedScale: null,
        nBins: 8,
        vizType: '2D',
        activeGeoid: '',
        overlay: '',
        resource: '',
        colorScale: [
            [255, 255, 229],
            [247, 252, 185],
            [217, 240, 163],
            [173, 221, 142],
            [120, 198, 121],
            [65, 171, 93],
            [35, 132, 67],
            [0, 90, 50],
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
        table: 'cases',
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
        location: '',
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
        storiesPane: false,
    },
    tooltipInfo: {
        x: 0,
        y: 0,
        data: null,
        geoid: null,
    },
    shouldUpdate: true,
    isLoading: true,
    mapScreenshotData: {},
    shouldPanMap: false,
    colorFilter: false,
    variableMenuWidth: 0,
}

export default INITIAL_STATE
