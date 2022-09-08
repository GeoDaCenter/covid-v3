import { combineReducers } from "redux";
import data from "../reducers/dataReducer";
import params from "../reducers/paramsReducer";
import ui from "../reducers/uiReducer";
import stories from "../reducers/storiesReducer";
import report from "../reducers/reportBuilderReducer";

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['report']
  }
const reportPersistConfig = {
    key: 'atlas-reports',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['reports'] 
  }

const rootReducer = combineReducers({
    data,
    params,
    ui,
    report: persistReducer(reportPersistConfig, report),
    stories
})

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer)