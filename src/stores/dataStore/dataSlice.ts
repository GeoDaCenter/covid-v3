import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dataset, DataState, DotDensityDatashape, WeightSpec } from './types'
import {
    externalStoredGeojson,
    externalStoredData,
    //@ts-ignore
} from './nonReactiveDataStore'
// @ts-ignore
import { reconcileData, indexGeoProps, getIdOrder } from './utils'
// @ts-ignore
import DEFAULTS from './dataInitialState'
const initialState = DEFAULTS as DataState

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        loadDotDensityData(
            state,
            action: PayloadAction<Array<[number, number, number, number]>>
        ) {
            state.dotDensityData = action.payload
        },
        reconcileTable(
            state,
            action: PayloadAction<{ data: { [key: string]: Dataset } }>
        ) {
            reconcileData(action.payload, state.storedData, externalStoredData)
        },
        reconcileTables(
            state,
            action: PayloadAction<Array<{ data: { [key: string]: Dataset } }>>
        ) {
            for (let i = 0; i < action.payload.length; i++) {
                reconcileData(
                    action.payload[i],
                    state.storedData,
                    externalStoredData
                )
            }
        },
        addWeights: (
            state,
            action: PayloadAction<{ weights: WeightSpec; id: string }>
        ) => {
            const { weights, id } = action.payload
            state.storedGeojson[id].weights = weights
        },
        loadGeojson(
            state,
            action: PayloadAction<{
                [key: string]: {
                    data: GeoJSON.FeatureCollection
                    joinCol: string
                    mapId: string
                }
            }>
        ) {
            const [fileName, geojson] = Object.entries(action.payload)[0]
            externalStoredGeojson[fileName] = {
                ...geojson,
                properties: indexGeoProps(geojson.data, geojson.joinCol),
                order: getIdOrder(
                    geojson?.data?.features || [],
                    geojson.joinCol
                ),
            }
            //@ts-ignore
            state.storedGeojson[fileName] = {
                weights: {},
            }
            // console.log(storedGeojson)
            // console.log(state.storedGeojson)
        },
        // loadResource(state, action: PayloadAction<{data: {[key:string]: any}[], id: string}>) {
        //     state.resourceLayerData[action.payload.id] = action.payload.data
        // },
        setTicking(state, action: PayloadAction<boolean>) {
            state.isTicking = action.payload
        },
        setCanLoadInBackground(state, action: PayloadAction<boolean>) {
            state.canLoadInBackground = action.payload && !state.isTicking
        },
        setDotDensityData: (
            state,
            action: PayloadAction<DotDensityDatashape>
        ) => {
            state.dotDensityData = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const dataActions = dataSlice.actions
export default dataSlice.reducer

interface DataStateOuter {
    data: DataState
}
export const dataSelectors = {
    selectDotDensityData: (state: DataStateOuter) => state.data.dotDensityData,
    selectStoredData: (state: DataStateOuter) => state.data.storedData,
    selectStoredDataset: (id: string) => (state: DataStateOuter) => ({
        ...(state.data?.storedData?.[id] || {}),
        data: externalStoredData[id]?.data,
    }),
    selectStoredDatasets: (ids: string[]) => (state: DataStateOuter) =>
        ids.map((id) => ({
            ...(state.data?.storedData?.[id] || {}),
            data: externalStoredData[id]?.data,
        })),
    selectStoredDatasetsDictionary: (ids: string[]) => (state: DataStateOuter) =>
        ids.reduce(
                (prev, id) => ({
                    ...prev,
                    [id]: {
                        ...(state.data?.storedData?.[id] || {}),
                        data: externalStoredData[id]?.data,
                    },
                }),
                {}
        ),
    selectStoredGeojson: (state: DataStateOuter) => ({
        weights: state.data.storedGeojson,
        data: externalStoredGeojson,
        properties: externalStoredGeojson.properties,
        order: externalStoredGeojson.order,
        joinCol: externalStoredGeojson.joinCol,
        mapId: externalStoredGeojson.mapId,
    }),
    selectGeojsonData: (name: string) => (state: DataStateOuter) => ({
        weights: state.data.storedGeojson?.[name]?.weights,
        data: externalStoredGeojson?.[name]?.data,
        properties: externalStoredGeojson?.[name]?.properties,
        order: externalStoredGeojson?.[name]?.order,
        joinCol: externalStoredGeojson?.[name]?.joinCol,
        mapId: externalStoredGeojson?.[name]?.mapId,
    }),
    selectDateset: (id: string) => (state: DataStateOuter) =>
        state.data.storedData[id],
    selectGeojson: (id: string) => (state: DataStateOuter) =>
        state.data.storedGeojson[id],
    selectMultiDatasets: (ids: Array<string>) => (state: DataStateOuter) =>
        ids.map((id) => state.data.storedData[id]),
    selectCanLoadInBackground: (state: DataStateOuter) =>
        state.data.canLoadInBackground,
    selectIsTicking: (state: DataStateOuter) => state.data.isTicking,
}
