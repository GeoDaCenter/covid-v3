import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ParamsUiState, VariableSpec, MapParamsSpec } from './types'
import {
    resolveName,
    findIn,
    findClosestValue,
    findDefaultOrCurrent,
    findTableOrDefault,
    findNextIndex,
    // @ts-ignore
} from '../../utils'
// @ts-ignore
import dataDateRanges from '../../config/dataDateRanges'
// @ts-ignore
import { colorScales } from '../../config/scales'
// @ts-ignore
import DEFAULTS from './paramsInitialState'
const initialState = DEFAULTS as ParamsUiState

export const paramsSlice = createSlice({
    name: 'params',
    initialState,
    reducers: {
        // ui
        setTooltipInfo: (
            state,
            action: PayloadAction<{
                data: string | number | { [key: string]: any }
                x: number
                y: number
                id: string
            }>
        ) => {
            state.tooltipInfo = {
                x: action.payload.x + 60 + state.variableMenuWidth,
                y: action.payload.y + 10 + 50,
                // @ts-ignore
                data: action.payload.data,
                geoid: +action?.payload?.id,
            }
        },
        setStopPlaying: (state) => {
            state.isPlaying = false
        },
        setMapLoaded(state, action: PayloadAction<boolean>) {
            state.mapLoaded = action.payload
        },
        setIsLoading(state) {
            state.isLoading = true
        },
        setNotification(
            state,
            action: PayloadAction<{ info: string; location: string }>
        ) {
            state.notification = {
                info: action.payload.info,
                location: action.payload.location,
            }
        },
        setPanelState(
            state,
            action: PayloadAction<{
                [panel: keyof ParamsUiState['panelState']]: boolean
            }>
        ) {
            state.panelState = {
                ...state.panelState,
                ...action.payload,
            }
        },
        toggleMobilePanel: (state, action: PayloadAction<string>) => {
            state.panelState = {
                ...Object.keys(state.panelState).reduce(
                    (prev, panel) => ({ ...prev, [panel]: false }),
                    {}
                ),
                [action.payload]: !state.panelState[action.payload],
            }
        },
        togglePanel: (state, action: PayloadAction<string>) => {
            state.panelState[action.payload] = !state.panelState[action.payload]
        },
        setVariableMenuWidth: (state, action: PayloadAction<number>) => {
            state.variableMenuWidth = action.payload
        },
        setMapDidPan: (state) => {
            state.shouldPanMap = false
        },
        setColorfilter: (state, action: PayloadAction<number[]>) => {
            state.colorFilter = action.payload
        },
        // map params
        setCurrentData(state, action: PayloadAction<string>) {
            const prevDataset = findIn(
                state.datasets,
                'file',
                state.currentData
            )
            const currDataset = state.datasets.find(
                (f) =>
                    f.geography === prevDataset.geography &&
                    f.name === action.payload
            )
            if (currDataset) {
                state.currentData = currDataset.file
                state.currentTable = {
                    numerator: findTableOrDefault(
                        currDataset,
                        state.tables,
                        state.dataParams.numerator
                    ),
                    denominator: findTableOrDefault(
                        currDataset,
                        state.tables,
                        state.dataParams.denominator
                    ),
                }
                state.selectionKeys = []
                state.selectionNames = []
            }
        },
        setDates(state, action: PayloadAction<string[]>) {
            state.dates = action.payload
        },
        incrementDate(
            state,
            action: PayloadAction<{
                index: number
                currDatesAvailable: number[]
            }>
        ) {
            const { index, currDatesAvailable } = action.payload
            const nextIndex = findNextIndex({
                currDatesAvailable,
                currDateIndex: state.dataParams.nIndex,
                step: index,
            })
            if (nextIndex !== false) {
                state.dataParams = {
                    ...state.dataParams,
                    nIndex: nextIndex,
                    dIndex: nextIndex,
                }
            }
        },
        changeGeography(state, action: PayloadAction<string>) {
            const newGeog = action.payload
            const relevantDatasets = state.datasets.filter(
                (f) => f.geography === newGeog
            )
            if (relevantDatasets.length === 0) {
                return state
            }
            const currentDataset = findIn(
                state.datasets,
                'file',
                state.currentData
            )
            const sameDatasetDifferentGeography = relevantDatasets.filter(
                (f) => f.name === currentDataset.name
            )
            if (sameDatasetDifferentGeography.length > 0) {
                state.currentData = sameDatasetDifferentGeography[0].file
            } else {
                state.currentData = relevantDatasets[0].file
            }

            state.selectionKeys = []
            state.selectionNames = []
        },
        changeVariable(state, action: PayloadAction<string>) {
            // find target params
            let currVariableParams = findIn(
                state.variables,
                'variableName',
                action.payload
            )
            // find current dataset
            let currDataset = findIn(state.datasets, 'file', state.currentData)
            // check if current dataset geography compatible with target variable
            const currentData = state.variableTree[
                action.payload
            ].hasOwnProperty(currDataset.geography)
                ? state.currentData
                : findDefaultOrCurrent(
                      state.tables,
                      state.datasets,
                      currVariableParams,
                      currDataset.name
                  )
            // update variable to match target, if changed
            currDataset = findIn(state.datasets, 'file', currentData)
            // declare tables
            const currentTable = {
                numerator: findTableOrDefault(
                    currDataset,
                    state.tables,
                    currVariableParams.numerator
                ),
                denominator: findTableOrDefault(
                    currDataset,
                    state.tables,
                    currVariableParams.denominator
                ),
            }
            const dataName =
                currentTable.numerator?.name?.split('.')[0] ||
                currentTable.numerator?.name?.split('.')[0]
            // pull index cases
            const currIndex =
                currVariableParams.nIndex ||
                currVariableParams.dIndex ||
                state.dataParams.nIndex ||
                state.dataParams.dIndex
            // update variable index
            currVariableParams.nIndex =
                currVariableParams.nType === 'characteristic' ||
                state.dataParams.nIndex === null
                    ? null
                    : dataDateRanges[dataName] &&
                      dataDateRanges[dataName][currIndex]
                    ? currIndex
                    : findClosestValue(currIndex, dataDateRanges[dataName])
            // scales
            let colorScale = []
            if (state.mapParams.mapType === 'natural_breaks') {
                colorScale = currVariableParams.colorScale
                    ? colorScales[currVariableParams.colorScale]
                    : colorScales['natural_breaks']
            } else {
                colorScale = state.mapParams.colorScale
            }

            const mapParams = {
                ...state.mapParams,
                colorScale,
            }

            state.currentData = currentData
            state.selectionKeys =
                currentData === state.currentData ? state.selectionKeys : []
            state.currentTable = currentTable
            state.dataParams = currVariableParams
            state.mapParams = mapParams
        },
        setDataParams(state, action: PayloadAction<Partial<VariableSpec>>) {
            state.dataParams = {
                ...state.dataParams,
                ...action.payload,
            }
        },
        setMapParams(state, action: PayloadAction<Partial<MapParamsSpec>>) {
            state.mapParams = {
                ...state.mapParams,
                ...action.payload,
            }
        },
        clearSelection(state) {
            state.selectionKeys = []
            state.selectionNames = []
        },
        updateSelection: (
            state,
            action: PayloadAction<{
                geoid: number | number[]
                type: 'remove' | 'update' | 'append' | 'bulk-append'
            }>
        ) => {
            switch (action.payload.type) {
                case 'update': {
                    state.selectionKeys = [action.payload.geoid] as number[]
                    break
                }
                case 'append': {
                    const geoid = action.payload.geoid as number
                    if (state.selectionKeys.indexOf(geoid) === -1) {
                        state.selectionKeys.push(geoid)
                    }
                    break
                }
                case 'bulk-append': {
                    const geoids = action.payload.geoid as number[]
                    geoids.forEach((geoid) => {
                        if (state.selectionKeys.indexOf(geoid) === -1) {
                            state.selectionKeys.push(geoid)
                        }
                    })
                    break
                }
                case 'remove':
                    {
                        const geoid = action.payload.geoid as number
                        const index = state.selectionKeys.indexOf(geoid)
                        if (index !== -1) {
                            state.selectionKeys.splice(index, 1)
                        }
                    }
                    break
                default:
                    break
            }
        },
        setAnchorEl: (
            state,
            action: PayloadAction<React.RefObject<HTMLElement> | null>
        ) => {
            // @ts-ignore
            state.anchorEl = action.payload
        },
        toggleDotDensityMode: (state) => {
            state.mapParams.dotDensityParams.colorCOVID =
                !state.mapParams.dotDensityParams.colorCOVID
        },
        toggleDotDensityRace: (state, action: PayloadAction<number>) => {
            state.mapParams.dotDensityParams.raceCodes[action.payload] =
                !state.mapParams.dotDensityParams.raceCodes[action.payload]
        },
        setdotDensityBackgroundOpacity: (
            state,
            action: PayloadAction<{ opacity: number }>
        ) => {
            state.mapParams.dotDensityParams.backgroundTransparency =
                action.payload.opacity
        },
        setColorFilter: (state, action: PayloadAction<number[]>) => {
            state.colorFilter = action.payload
        },
        addCustomDataSpecs: (
            state,
            action: PayloadAction<{
                dataName: string
                variables: VariableSpec[]
            }>
        ) => {
            const { dataName, variables: newVariables } = action.payload

            state.tables.push({
                name: dataName,
                geography: dataName,
                table: dataName,
                fileType: null,
                dataType: 'characteristic',
                join: 'idx',
                default: 1,
                id: dataName,
            })

            state.datasets.push({
                name: dataName,
                file: dataName,
                geography: dataName,
                join: 'idx',
                tables: {},
                isCustom: true,
            })

            state.variableTree[`HEADER: ${dataName}`] = {}

            const variablesList = state.variables.map(
                (f: VariableSpec) => f.variableName
            )

            newVariables.forEach((newVariable: VariableSpec) => {
                let currVariable = resolveName(
                    newVariable.variableName,
                    variablesList
                )
                variablesList.push(currVariable)
                state.variables.unshift({
                    ...newVariable,
                    variableName: currVariable,
                    customData: dataName,
                })

                state.variableTree[currVariable] = {
                    [dataName]: [dataName],
                }
            })

            state.urlParamsTree[dataName] = {
                name: dataName,
                geography: dataName,
            }
            state.currentData = dataName
            state.dataParams = state.variables[0]
            state.currentTable = {
                numerator: 'properties',
                denominator: 'properties',
            }
            state.mapParams.vizType = '2D'
            state.shouldPanMap = true
        },
    },
})

// Action creators are generated for each case reducer function
export const paramsActions = paramsSlice.actions
export default paramsSlice.reducer

interface ParamsStateOuter {
    params: ParamsUiState
}
export const paramsSelectors = {
    // ui
    selectPanelState: (state: ParamsStateOuter) => state.params.panelState,
    selectSinglePanelState: (panel: string) => (state: ParamsStateOuter) =>
        state.params.panelState[panel],
    selectColorFilter: (state: ParamsStateOuter) => state.params.colorFilter,
    selectNotification: (state: ParamsStateOuter) => state.params.notification,
    // params
    selectTables: (state: ParamsStateOuter) => state.params.tables,
    selectDatasets: (state: ParamsStateOuter) => state.params.datasets,
    selectVariables: (state: ParamsStateOuter) => state.params.variables,
    selectCurrentData: (state: ParamsStateOuter) => state.params.currentData,
    selectSelectionKeys: (state: ParamsStateOuter) =>
        state.params.selectionKeys,
    selectDataParams: (state: ParamsStateOuter) => state.params.dataParams,
    selectPartialDataParam:
        (param: keyof ParamsUiState['dataParams']) =>
        (state: ParamsStateOuter) =>
            state.params.dataParams[param],
    selectMapParams: (state: ParamsStateOuter) => state.params.mapParams,
    selectPartialMapParam:
        (param: keyof ParamsUiState['mapParams']) =>
        (state: ParamsStateOuter) =>
            state.params.mapParams[param],
    selectDates: (state: ParamsStateOuter) => state.params.dates,
    selectCurrentTable: (state: ParamsStateOuter) => state.params.currentTable,
    selectAnchorEl: (state: ParamsStateOuter) => state.params.anchorEl,
    selectVariableMenuWidth: (state: ParamsStateOuter) =>
        state.params.variableMenuWidth,
    selectTooltipInfo: (state: ParamsStateOuter) => state.params.tooltipInfo,
    selectVariableTree: (state: ParamsStateOuter) => state.params.variableTree,
    selectUrlParamsTree: (state: ParamsStateOuter) =>
        state.params.urlParamsTree,
}
