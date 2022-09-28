import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dataset, DataState, DotDensityDatashape, WeightSpec } from './types'
// @ts-ignore
import { reconcileData, indexGeoProps, getIdOrder } from './utils'
// @ts-ignore
import DEFAULTS from './dataInitialState'
const initialState = DEFAULTS as DataState

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    loadDotDensityData(state, action: PayloadAction<Array<[number, number, number, number]>>){
        state.dotDensityData = action.payload
    },
    reconcileTable(state, action: PayloadAction<{data: {[key:string]: Dataset}}>){
      reconcileData(
        action.payload,
        state.storedData
      );
    },
    reconcileTables(state, action: PayloadAction<Array<{data: {[key:string]: Dataset}}>>){
        action.payload.forEach((payload) => {
            reconcileData(
                payload.data,
                state.storedData
            );
        })
    },
    addWeights: (state, action: PayloadAction<{weights: WeightSpec, id: string}>) => {
        const { weights, id } = action.payload
        state.storedGeojson[id].weights = weights
    },
    loadGeojson(state, action: PayloadAction<{[key:string]: {data: GeoJSON.FeatureCollection, joinCol: string, mapId: string}}>) {
      const [fileName, geojson] = Object.entries(action.payload)[0]
      state.storedGeojson[fileName] = {
        ...geojson,
        properties: indexGeoProps(geojson.data, geojson.joinCol),
        order: getIdOrder(geojson?.data?.features || [], geojson.joinCol),
        weights: {}
      }
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
    setDotDensityData: (state, action: PayloadAction<DotDensityDatashape>) => {
        state.dotDensityData = action.payload
    }
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
  selectStoredGeojson: (state: DataStateOuter) => state.data.storedGeojson,
  selectDateset: (id: string) => (state: DataStateOuter) => state.data.storedData[id],
  selectGeojson: (id: string) => (state: DataStateOuter) => state.data.storedGeojson[id],
  selectMultiDatasets: (ids: Array<string>) => (state: DataStateOuter) => ids.map(id => state.data.storedData[id]),
  selectCanLoadInBackground: (state: DataStateOuter) => state.data.canLoadInBackground,
  selectIsTicking: (state: DataStateOuter) => state.data.isTicking,
}
