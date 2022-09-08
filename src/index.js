import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { createStore } from "redux";
import { persistedReducer } from "./reducers/rootReducer";
import { GeodaProvider } from "./contexts/Geoda";

import App from "./App";
import "./index.css";

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { StoriesProvider } from "./contexts/StoriesContext";

const store = createStore(
  persistedReducer,
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__({
    stateSanitizer: (state) => ({
      ...state,
      data: '<<<EXCLUDED>>>',
    })
  })
);
const persistor = persistStore(store)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GeodaProvider>
          <StoriesProvider>
            <App />
          </StoriesProvider>
        </GeodaProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
  // serviceWorkerRegistration.register();
);
