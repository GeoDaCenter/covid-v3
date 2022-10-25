import React from 'react'
import ReactDOM from 'react-dom'
import { GeodaProvider } from './contexts/Geoda'
import { ReduxProvider } from './stores'
import { StoriesProvider } from './contexts/StoriesContext'
import App from './App'
import './index.css'

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider>
            <GeodaProvider>
                <StoriesProvider>
                    <App />
                </StoriesProvider>
            </GeodaProvider>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
    // serviceWorkerRegistration.register();
)
