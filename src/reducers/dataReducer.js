import INITIAL_STATE from "../constants/dataInitialState";
import { indexGeoProps, getIdOrder } from "../utils";

const orderInts = (a, b) => a - b;
const onlyUnique = (value, index, self) => self.indexOf(value) === index;

function reconcileData(payload, storedData){  
  const { name, newData, timespan, error } = payload;
  const isStaticData = newData && !!newData.columns & !newData.dateIndices;
  const dataError = 
    (newData?.dateIndices && !newData.dateIndices.length) ||
    (newData &&
      newData.dateIndices &&
      storedData[name] &&
      storedData[name].dates &&
      newData.dateIndices.join("") === storedData[name].dates.join(""));

  // If the data doesn't exist, easy. Just plug in the full dataset
  // and move on to the next
  if (!storedData.hasOwnProperty(name)) {
    storedData[name] = {
      loaded: [],
      dates: [],
      data: {}
    };
  }
  // } else 
  if (error || dataError) {
    storedData[name].loaded.push(timespan);
  } if (isStaticData) {
    storedData[name] = {
      ...newData
    }
  } else {
    const {
      data,
      dateIndices
    } = newData;
    if (!data || !dateIndices) return;
    
    const geoids = Object.keys(data)
    if (Object.keys(storedData[name].data).length === 0) {
      for (let i=0; i<geoids.length;i++){
        storedData[name].data[geoids[i]] = {}
      }
    }
    for (let i=0; i<geoids.length;i++){
      for (let j=0;j<dateIndices.length;j++){
        storedData[name].data[geoids[i]][dateIndices[j]] = data[geoids[i]][j]; 
      }
    }
    storedData[name].loaded.push(timespan);
    storedData[name].dates = [
      ...storedData[name].dates,
      ...dateIndices
    ].filter(onlyUnique).sort(orderInts);
  }
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOAD_DOT_DENSITY_DATA":
      return {
        ...state,
        dotDensityData: action.payload,
      };

    case "RECONCILE_TABLE": {
      // expected shape: // type: 'RECILE_TABLES', payload: { data: { dataset1: {data,dates,columns}}}
      let storedData = {
        ...state.storedData,
      };
      reconcileData(
        action.payload,
        storedData
      );
      return {
        ...state,
        storedData,
      };
    }
    case "RECONCILE_TABLES": {
      let storedData = {
        ...state.storedData,
      };
      action.payload.data.forEach(dataset => reconcileData(dataset, storedData))
      return {
        ...state,
        storedData,
      };
    }
    case "SET_DATA": {
      return {
        ...state,
        storedData: action.payload.storedData
      }
    }
    case "ADD_WEIGHTS": {
      // id, weights
      return {
        ...state,
        storedGeojson: {
          ...state.storedGeojson,
          [action.payload.id]: {
            ...state.storedGeojson[action.payload.id],
            weights: {
              ...state.storedGeojson[action.payload.id].weights,
              ...action.payload.weights,
            },
          },
        },
      };
    }
    case "LOAD_GEOJSON":{
      const [fileName, geojson] = Object.entries(action.payload)[0]
      const properties = indexGeoProps(geojson.data, geojson.joinCol);
      const order = getIdOrder(geojson?.data?.features || [], geojson.joinCol);
      return {
        ...state,
        storedGeojson: {
          ...state.storedGeojson,
          [fileName]: {
            ...geojson,
            properties,
            order,
            weights: {}
          }
        }
      }
    }
    case "LOAD_RESOURCE":
      return {
        ...state,
        resourceLayerData: {
          ...state.resourceLayerData,
          [action.payload.id]: action.payload.data,
        },
      };
    case "SET_TICKING": {
      return {
        ...state,
        isTicking: action.payload
      }
    }
    case "SET_CAN_LOAD_IN_BACKGROUND":{
      return {
        ...state,
        canLoadInBackground: action.payload && !state.isTicking,
      }
    }
    default:
      return state;
  }
}
