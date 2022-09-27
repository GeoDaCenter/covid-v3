import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

// Helper and Utility functions //
// first row: data loading
// second row: data parsing for specific outputs
// third row: data accessing
import { findIn, getDateLists } from '../../utils' //getVarId

// Actions -- Redux state manipulation following Flux architecture //
// first row: data storage
// second row: data and metadata handling
// third row: map and variable parameters
import {
    setDates,
    // setMapParams,
    setNotification,
    setPanelState,
} from '../../actions'
import {
    MapSection,
    NavBar,
    VariablePanel,
    Legend,
    TopPanel,
    Preloader,
    DataPanel,
    LineChart,
    // Scaleable,
    // Draggable,
    InfoBox,
    NotificationBox,
    Popover,
    MapTooltipContent,
    // PrintLayout,
    DataLoader,
    ReportBuilder,
    // Icon,
    IconDock,
    Scatterchart,
} from '../../components'
import { ViewportProvider } from '../../contexts/Viewport'
import { fitBounds } from '@math.gl/web-mercator'
import colors from '../../config/colors'

import useMapData from '../../hooks/useMapData'
import { StoryViewerPane } from '../Panels/StoryViewerPane'
import { Alert, Button, Snackbar } from '@mui/material'
import { Box } from '@mui/system'
import { getDefaultDimensions } from '../../utils/getDefaultDimensions'
import { paramsSelectors } from '../../stores/paramsStore'
const {
    selectMapParams,
    selectDataParams,
    selectCurrentData,
    selectDatasets,
    selectPanelState,
    selectPartialDataParam,
} = paramsSelectors
// Main function, App. This function does 2 things:
// 1: App manages the majority of the side effects when the state changes.
//    This takes the form of React's UseEffect hook, which listens
//    for changes in the state and then performs the functions in the hook.
//    App listens for different state changes and then calculates the relevant
//    side effects (such as binning calculations and GeoDa functions, column parsing)
//    and then dispatches new data to the store.
// 2: App assembles all of the components together and sends Props down
//    (as of 12/1 only Preloader uses props and is a higher order component)

const dateLists = getDateLists()
// US bounds

let paramsDict = {}
for (const [key, value] of new URLSearchParams(window.location.search)) {
    paramsDict[key] = value
}

const defaultViewport = paramsDict.hasOwnProperty('lat')
    ? {
          latitude: +paramsDict.lat,
          longitude: +paramsDict.lon,
          zoom: +paramsDict.z,
          pitch: paramsDict.viz === '3D' ? 30 : 0,
          bearing: paramsDict.viz === '3D' ? -30 : 0,
      }
    : fitBounds({
          width: window.innerWidth,
          height: window.innerHeight,
          bounds: [
              [-130.14, 53.96],
              [-67.12, 19],
          ],
      })

const MapContainer = styled.div``

const MapOuterContainer = styled.div`
    position: relative;
    width: 100%;
    height: calc(100vh - 50px);
    overflow: hidden;
`

const MapPlaneContainer = styled.div`
    display: ${({ noRender }) => (noRender ? 'none' : 'flex')};
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: relative;
    @media (max-width: 768px) {
        display: ${({ noRender }) => (noRender ? 'none' : 'block')};
    }
`

const RightPaneContainer = styled.div`
    flex: 0 1 auto;
    height: calc(100vh - 50px);
    display: flex;
    position: fixed;
    right: 0;
    top: 50px;
    flex-direction: column;
    overflow: hidden;
    pointer-events: none;
    z-index: 15;
    * {
        pointer-events: auto;
    }
`

const MapApp = styled.div`
    overflow: hidden;
    max-height: 100vh;
    @media print {
        display: none;
        * {
            display: none;
        }
    }
`

const AlertBox = styled(Box)`
    display: flex;
    position: relative;
    justify-content: space-between;
    flex-direction: column;
    p {
        max-width: 50ch;
        margin: 1em 0;
    }
    button,
    a {
        background: none;
        outline: none;
        color: ${colors.teal};
        font-weight: bold;
        font-size: 1rem;
        padding: 0.25em 0.5em;
        border: none;
        cursor: pointer;
    }
    button {
        background: ${colors.lightgray}55;
        border: 1px solid ${colors.gray};
    }
    button:focus {
        border: 1px solid ${colors.teal};
    }
    a {
    }
`

const CloseButton = styled(Button)`
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    outline: none;
    padding: 0 0.5em;
    min-width: initial;
`

export default function Map() {
    const dispatch = useDispatch()
    // // Dispatch helper functions for side effects and data handling
    // Get centroid data for cartogram
    // const getCentroids = (geojson, geoda) =>  dispatch(setCentroids(geoda.GetCentroids(geojson), geojson))

    // After runtime is initialized, this loads in geoda to the context
    useEffect(() => {
        let paramsDict = {}
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        for (const [key, value] of urlParams) {
            paramsDict[key] = value
        }

        if (!paramsDict.hasOwnProperty('v')) {
            // do nothing, most of the time
        } else if (paramsDict['v'] === '1') {
            dispatch(
                setNotification(
                    `
          <h2>Welcome to the Atlas v2!</h2>
          <p>
          The share link you have entered is for an earlier release of the US Covid Atlas. 
          Explore the new version here, or continue using your current share link by click below.
          <a href="./vintage/map.html${window.location.search}" target="_blank" rel="noopener noreferrer" style="color:${colors.yellow}; text-align:center;">
            <h3 style="text-align:center">
              US Covid Atlas v1
            </h3>  
          </a>
          </p>
        `,
                    'center'
                )
            )
        }

        if (window.innerWidth <= 1024) {
            dispatch(
                setPanelState({
                    variables: false,
                    info: false,
                    tutorial: false,
                    lineChart: false,
                })
            )
        }

        dispatch(setDates(dateLists.isoDateList))
    }, [])

    return (
        <>
            <MapApp className="Map-App">
                <NavBar />
                <MapOuterContainer>
                    <ViewportProvider defaultViewport={defaultViewport}>
                        <MapPageContainer />
                    </ViewportProvider>
                </MapOuterContainer>
            </MapApp>
        </>
    )
}

const MapContainerInner = () => {
    // These selectors access different pieces of the store. While App mainly
    // dispatches to the store, we need checks to make sure side effects
    // are OK to trigger. Issues arise with missing data, columns, etc.
    const mapParams = useSelector(selectMapParams)
    const dataParams = useSelector(selectDataParams)
    const currentData = useSelector(selectCurrentData)
    const dataNote = dataParams.dataNote
    const fixedScale = dataParams.fixedScale
    const variableName = dataParams.variableName
    const datasets = useSelector(selectDatasets)
    const currIdCol = findIn(datasets, 'file', currentData).join
    const [
        currentMapGeography,
        currentMapData,
        { cartogramData, cartogramCenter, cartogramDataSnapshot },
        currentMapID,
        currentBins,
        currentHeightScale,
        isLoading,
        ,
        ,
        isBackgroundLoading,
    ] = useMapData({
        dataParams,
        mapParams,
        currentData,
    })
    return (
        <>
            <Preloader
                loading={isLoading || isBackgroundLoading}
                quiet={isBackgroundLoading}
                message={
                    isBackgroundLoading
                        ? 'Loading additional data...'
                        : 'Loading'
                }
            />
            <MapSection
                currentMapGeography={currentMapGeography}
                currentMapData={currentMapData}
                currentMapID={currentMapID}
                currentHeightScale={currentHeightScale}
                cartogramData={cartogramData}
                cartogramCenter={cartogramCenter}
                cartogramDataSnapshot={cartogramDataSnapshot}
                isLoading={isLoading}
                mapParams={mapParams}
                currentData={currentData}
                currIdCol={currIdCol}
            />
            <Legend
                variableName={variableName}
                colorScale={mapParams.colorScale}
                bins={currentBins}
                fixedScale={fixedScale}
                resource={mapParams.resource}
                note={dataNote}
                shouldSeparateZero={
                    dataParams.separateZero &&
                    mapParams.mapType === 'natural_breaks'
                }
            />
        </>
    )
}
const MapPageContainer = () => {
    // const dispatch = useDispatch();
    const panelState = useSelector(selectPanelState)
    const nType = useSelector(selectPartialDataParam('nType'))
    const showTopPanel = nType !== 'characteristic'
    const [defaultDimensions, setDefaultDimensions] = useState(
        getDefaultDimensions()
    )
    const [storiesSnackbar, setStoriesSnackbar] = useState(true)
    // const handleOpenStories = () => {
    //   dispatch(setPanelState({ storiesPane: true, lineChart: false }));
    //   dispatch(setMapParams({ overlay: "stories" }));
    //   setStoriesSnackbar(false);
    // };
    // default width handlers on resize
    useEffect(() => {
        typeof window &&
            window.addEventListener('resize', () =>
                setDefaultDimensions({ ...getDefaultDimensions() })
            )
    }, [])

    return (
        <MapContainer>
            <Snackbar
                open={storiesSnackbar}
                autoHideDuration={10000}
                onClose={() => setStoriesSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="info"
                    sx={{ width: '100%', textAlign: 'center' }}
                >
                    <AlertBox>
                        <h3>Atlas Stories is live!</h3>
                        <div>
                            <p>
                                Atlas Stories collects stories behind the
                                statistics and data from the diverse
                                perspectives and experiences in the United
                                States.
                            </p>
                        </div>
                        <div>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        'https://stories.uscovidatlas.org/')
                                }
                                variant="contained"
                                sx={{
                                    background: `${colors.yellow} !important`,
                                    textTransform: 'none',
                                }}
                            >
                                Submit a Story
                            </Button>
                            {/* <button onClick={handleOpenStories}>See Stories</button> */}
                        </div>
                        <CloseButton
                            variant="text"
                            onClick={() => setStoriesSnackbar(false)}
                        >
                            &times;
                        </CloseButton>
                    </AlertBox>
                </Alert>
            </Snackbar>
            {false && (
                <div id="loadingIcon">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/img/animated_cluster.svg`}
                        role="presentation"
                        alt=""
                    />
                </div>
            )}
            <MapPlaneContainer noRender={panelState.reportBuilder}>
                <IconDock />
                <VariablePanel />
                <MapContainerInner />
                <RightPaneContainer>
                    {panelState.lineChart && (
                        <LineChart defaultDimensions={defaultDimensions} />
                    )}
                    {panelState.storiesPane && <StoryViewerPane />}
                    {panelState.scatterChart && <Scatterchart />}
                    <DataPanel />
                </RightPaneContainer>
                {!!showTopPanel && <TopPanel />}
            </MapPlaneContainer>

            <ReportBuilder />
            <DataLoader />
            <Popover />
            <NotificationBox />
            {panelState.tutorial && (
                <InfoBox
                    defaultX={defaultDimensions.defaultXManual}
                    defaultY={defaultDimensions.defaultYManual}
                    defaultWidth={defaultDimensions.defaultWidthManual}
                    defaultHeight={defaultDimensions.defaultHeightManual}
                    minHeight={defaultDimensions.minHeight}
                    minWidth={defaultDimensions.minWidth}
                />
            )}
            <MapTooltipContent />
        </MapContainer>
    )
}
