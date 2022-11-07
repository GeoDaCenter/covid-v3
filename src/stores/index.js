
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

import { dataReducer } from './dataStore';
import { paramsReducer } from './paramsStore';
import { reportReducer } from './reportStore';

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
	data: dataReducer,
	params: paramsReducer,
	report: persistReducer(reportPersistConfig, reportReducer),
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => (
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
	),
	devTools: true //process.env.NODE_ENV !== 'production',
})

const persistor = persistStore(store)

export const ReduxProvider = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}
