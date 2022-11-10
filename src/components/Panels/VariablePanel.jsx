import React, { useLayoutEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'

import styled from 'styled-components'

import Tooltip from '../Interface/Tooltip'
import { BinsContainer, Gutter } from '..'
import { StyledDropDown } from '..'
import colors from '../../config/colors'
import { findIn } from '../../utils'
import { Button, Grid } from '@mui/material'
import { paramsSelectors, paramsActions } from '../../stores/paramsStore'

const {
    setMapParams,
    setCurrentData,
    setPanelState,
    setMapType,
    toggleDotDensityMode,
    toggleDotDensityRace,
    setVariableMenuWidth,
    changeVariable,
    changeGeography,
    setDotDensityBgOpacity,
    setDateRangeType,
} = paramsActions
const {
    selectPartialMapParam,
    selectCurrentData,
    selectPanelState,
    selectPartialDataParam,
    selectDatasets,
    selectVariableTree,
    selectUrlParamsTree,
} = paramsSelectors

/** STYLES */
const VariablePanelContainer = styled.div`
    flex: 0.0001 1 auto;
    width: auto;
    background-color: ${colors.gray}fa;
    padding: 0;
    box-sizing: border-box;
    font: 'Lato', sans-serif;
    max-height: calc(100vh - 50px);
    color: white;
    z-index: 10;
    display: flex;
    flex-direction: column;
    h1,
    h2,
    h3,
    h4 {
        margin: 0 0 10px 0;
    }
    p {
        margin: 10px 0;
    }
    @media (max-width: 1024px) {
        min-width: 50vw;
    }
    @media (max-width: 600px) {
        width: 100%;
        display: ${(props) => (props.otherPanels ? 'none' : 'initial')};
        position: fixed;
        overflow-y: auto;
        padding-bottom: 20vh;
    }

    &.hidden {
        display: none;
    }
    user-select: none;
`
const NoteContainer = styled.div`
    flex: 1 1 1;
    padding: 0.5em 0 0.5em 1.25em;
    box-sizing: border-box;
    background: ${colors.gray};
    width: calc(100%);
    border-top: 1px solid black;
    a {
        color: ${colors.yellow};
        -webkit-text-decoration: none;
        text-decoration: none;
    }
    p.note {
        font-family: 'Lato', sans-serif;
        font-weight: 300;
        font-size: 90%;
        max-width: 42ch;
    }

    div.poweredByGeoda {
        color: white;
        width: 100%;
        text-align: center;
        @media (max-height: 900px) {
        }
        a {
            color: white;
            margin: 0 auto;
            text-decoration: none;
            letter-spacing: 2px;
            font-size: 75%;
            img {
                width: 23px;
                height: 27px;
                transform: translate(-50%, 40%);
            }
        }
    }
`

const DotDensityControls = styled.div`
    border: 1px solid ${colors.white}77;
    max-width: 20em;
    padding: 0 0.5em 1.5em 0.5em;
    p.help-text {
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: bold;
        text-align: center;
    }
    span.MuiSlider-root {
        margin: 1em 1em 0 1em;
        max-width: calc(100% - 2em);
        padding: 0;
        color: ${colors.white};
    }
`

const DateSelectorContainer = styled.div`
    opacity: ${(props) => (props.disabled ? 0.25 : 1)};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'initial')};
`

const TwoUp = styled.div`
    width: 100%;
    .MuiFormControl-root {
        width: auto;
        min-width: 8rem;
        margin-right: 5px;
    }
`

const ControlsContainer = styled.div`
    overflow-y: scroll;
    padding: 20px;
    flex: 1 1 5;

    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #2b2b2b;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #999;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
        transition: 125ms all;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #f9f9f9;
        background-position: center center;
        background-repeat: no-repeat, no-repeat;
        background-size: 50%, 100%;
    }
`

const ListSubheader = styled(MenuItem)`
    font-variant: small-caps;
    font-weight: 800;
`

const storiesButtonStyles = {
    background: colors.teal,
    textTransform: 'none',
    color: colors.white,
    width: 'calc(100% - 1em)',
    fontWeight: 'bold',
    fontSize: '16px',
}

const AcsRaceButton = styled.button`
    background: ${(props) =>
        props.active ? `rgb(${props.bgColor.join(',')})` : colors.darkgray};
    color: ${(props) => (props.active ? colors.black : colors.white)};
    text-align: left;
    border: none;
    outline: none;
    margin: 0.25em;
    padding: 0.5em;
    border-radius: 0.5em;
    cursor: pointer;
`
// END STYLES

const dotDensityAcsGroups = [
    {
        idx: 3,
        name: 'Black or African American',
    },
    {
        idx: 4,
        name: 'Hispanic or Latino',
    },
    {
        idx: 2,
        name: 'Asian',
    },
    {
        idx: 8,
        name: 'White',
    },
    {
        idx: 1,
        name: 'American Indian or Alaska Native',
    },
    {
        idx: 5,
        name: 'Native Hawaiian or Other Pacific Islander',
    },
    {
        idx: 6,
        name: 'Other',
    },
    {
        idx: 7,
        name: 'Two or more',
    },
]

const onlyUnique = (value, index, self) => self.indexOf(value) === index

const DotDensityControlSection = ({ isCustom = false }) => {
    const dispatch = useDispatch()
    const handleDotDensitySlider = (e, newValue) =>
        dispatch(setDotDensityBgOpacity(newValue))
    const dotDensityParams = useSelector(
        selectPartialMapParam('dotDensityParams')
    )
    return (
        <DotDensityControls>
            <p className="help-text">1 Dot = 500 People</p>
            <BinsContainer>
                {!isCustom && (
                    <>
                        <Switch
                            checked={dotDensityParams.colorCOVID}
                            onChange={() => dispatch(toggleDotDensityMode())}
                            name="dot density mode"
                            disabled={isCustom}
                        />
                        <p>
                            {dotDensityParams.colorCOVID
                                ? 'Color by COVID Data'
                                : 'Color by ACS Race / Ethnicity'}
                        </p>
                        <Gutter h={10} />
                        <p className="help-text">
                            Toggle ACS Race / Ethnicity Groups
                        </p>
                    </>
                )}
                <Gutter h={5} />
                {dotDensityAcsGroups.map((group) => (
                    <AcsRaceButton
                        active={dotDensityParams.raceCodes[group.idx]}
                        bgColor={colors.dotDensity[group.idx]}
                        key={group.name + 'dd-button'}
                        onClick={() =>
                            dispatch(toggleDotDensityRace(group.idx))
                        }
                    >
                        {group.name}
                    </AcsRaceButton>
                ))}
            </BinsContainer>
            <Gutter h={20} />
            <p className="help-text">Background Opacity</p>
            <Slider
                value={dotDensityParams.backgroundTransparency}
                min={0}
                step={0.01}
                max={1}
                onChange={handleDotDensitySlider}
            />
        </DotDensityControls>
    )
}

/**
 * Self-contained component to manage paramsSlice and chance variable, data,
 * etc.
 *
 * TODO: This component _should_ be refactored and cleaned up. It's a bit of a
 * mess.
 *
 * @category Components/Map
 * @component
 */
function VariablePanel() {
    const dispatch = useDispatch()

    const variablePanelRef = useRef(null)

    const currentData = useSelector(selectCurrentData)
    const binMode = useSelector(selectPartialMapParam('binMode'))
    const mapType = useSelector(selectPartialMapParam('mapType'))
    const vizType = useSelector(selectPartialMapParam('vizType'))
    const overlay = useSelector(selectPartialMapParam('overlay'))
    const resource = useSelector(selectPartialMapParam('resource'))
    const panelState = useSelector(selectPanelState)
    const variableName = useSelector(selectPartialDataParam('variableName'))
    const nType = useSelector(selectPartialDataParam('nType'))
    const nRange = useSelector(selectPartialDataParam('nRange'))
    const rangeType = useSelector(selectPartialDataParam('rangeType'))
    const datasets = useSelector(selectDatasets)
    const variableTree = useSelector(selectVariableTree)
    const urlParamsTree = useSelector(selectUrlParamsTree)

    // derived state
    const currentPreset = findIn(datasets, 'file', currentData)
    const notTooltipText = (text) => text !== "Tooltip"
    const allGeographies = Object.values(variableTree)
        .flatMap((o) => Object.keys(o))
        .filter(onlyUnique)
        .filter(notTooltipText)
    const allDatasets = Object.entries(variableTree)
        // ignore tooltip values
        .map(([_, geographies]) => {
            let dataObj = {}
            Object.keys(geographies).forEach(key => {
                if (key === "Tooltip") return 
                dataObj[key] = geographies[key]
            })
            return dataObj
        })
        .flatMap((o) => Object.values(o))
        .flatMap((o) => o)
        .filter(onlyUnique)
        
    const isCustom = !['State', 'County'].includes(currentPreset.geography)

    const availableData = currentPreset.geography
        ? allDatasets.filter(
              (dataset) =>
                  variableTree[variableName][currentPreset.geography].indexOf(
                      dataset
                  ) !== -1
          )
        : []
    const dataName = availableData.includes(urlParamsTree[currentData].name)
        ? urlParamsTree[currentData].name
        : availableData[0]

    const isTimeSeriesNonCumulative =
        variableName.indexOf('Testing') !== -1 ||
        variableName.indexOf('Workdays') !== -1

    // manage width offset
    useLayoutEffect(() => {
        dispatch(setVariableMenuWidth(variablePanelRef.current.offsetWidth))
    }, [])

    useLayoutEffect(() => {
        dispatch(setVariableMenuWidth(variablePanelRef.current.offsetWidth))
    }, [panelState.variables])

    // handlers
    const handleMapType = (_event, newValue) => dispatch(setMapType(newValue))
    const handleMapOverlay = (event) => {
        dispatch(
            setMapParams({
                overlay: event.target.value,
            })
        )
    }
    const handleMapResource = (event) => {
        dispatch(
            setMapParams({
                resource: event.target.value,
            })
        )
    }
    const handleVariable = (e) => dispatch(changeVariable(e.target.value))
    const handleGeography = (e) => dispatch(changeGeography(e.target.value))
    const handleVizType = (e) =>
        dispatch(setMapParams({ vizType: e.target.value }))
    const handleDataset = (e) => dispatch(setCurrentData(e.target.value))
    const handleRangeButton = (e) => dispatch(setDateRangeType(e.target.value))
    const handleSwitch = () =>
        dispatch(
            setMapParams({ binMode: binMode === 'dynamic' ? '' : 'dynamic' })
        )

    const handleToggleStories = () => {
        if (panelState.storiesPane) {
            dispatch(setPanelState({ storiesPane: false, lineChart: true }))
            dispatch(setMapParams({ overlay: '' }))
        } else {
            dispatch(setPanelState({ storiesPane: true, lineChart: false }))
            dispatch(setMapParams({ overlay: 'stories' }))
        }
    }

    return (
        <VariablePanelContainer
            className={panelState.variables ? '' : 'hidden'}
            otherPanels={panelState.info}
            id="variablePanel"
            ref={variablePanelRef}
        >
            {panelState.variables && (
                <ControlsContainer>
                    <Grid item xs={12} md={12} lg={6}>
                        <h2>
                            Data Sources &amp;
                            <br /> Map Variables
                        </h2>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Button
                            variant="contained"
                            sx={storiesButtonStyles}
                            onClick={handleToggleStories}
                        >
                            <Switch
                                checked={panelState.storiesPane}
                                onChange={handleToggleStories}
                                name="stories mode switch"
                                label="Atlas Stories"
                            />
                            Atlas Stories
                        </Button>
                    </Grid>
                    <Gutter h={20} />
                    <StyledDropDown id="variableSelect">
                        <InputLabel htmlFor="variableSelect">
                            Variable
                        </InputLabel>
                        <Select
                            value={variableName}
                            onChange={handleVariable}
                            MenuProps={{ id: 'variableMenu' }}
                        >
                            {Object.keys(variableTree).map((variable) => {
                                if (variable.split(':')[0] === 'HEADER') {
                                    return (
                                        <ListSubheader
                                            key={variable.split(':')[1]}
                                            disabled
                                        >
                                            {variable.split(':')[1]}
                                        </ListSubheader>
                                    )
                                } else {
                                    return (
                                        <MenuItem
                                            value={variable}
                                            key={variable}
                                        >
                                            {variable}
                                            {!!variableTree[variable]?.Tooltip && <Tooltip id={variableTree[variable].Tooltip} />}
                                        </MenuItem>
                                    )
                                }
                            })}
                        </Select>
                    </StyledDropDown>
                    <Gutter h={35} />
                    <DateSelectorContainer
                        disabled={nType === 'characteristic'}
                    >
                        <StyledDropDown id="dateSelector">
                            <InputLabel htmlFor="date-select">
                                Date Range
                            </InputLabel>
                            <Select
                                id="date-select"
                                value={
                                    nRange === null ||
                                    rangeType === 'custom' ||
                                    isTimeSeriesNonCumulative
                                        ? 'x'
                                        : nRange
                                }
                                onChange={handleRangeButton}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem
                                    value="x"
                                    disabled
                                    style={{ display: 'none' }}
                                >
                                    {rangeType === 'custom' && (
                                        <span>Custom Range</span>
                                    )}
                                    {nRange === null &&
                                        !isTimeSeriesNonCumulative && (
                                            <span>Cumulative</span>
                                        )}
                                    {variableName.indexOf('Testing') !== -1 && (
                                        <span>7-Day Average</span>
                                    )}
                                    {variableName.indexOf('Workdays') !==
                                        -1 && <span>Daily Average</span>}
                                </MenuItem>
                                <MenuItem
                                    value={null}
                                    key={'cumulative'}
                                    disabled={isTimeSeriesNonCumulative}
                                >
                                    Cumulative
                                </MenuItem>
                                <MenuItem
                                    value={1}
                                    key={'daily'}
                                    disabled={isTimeSeriesNonCumulative}
                                >
                                    Daily New
                                </MenuItem>
                                <MenuItem
                                    value={7}
                                    key={'7-day-ave'}
                                    disabled={isTimeSeriesNonCumulative}
                                >
                                    7-Day Average
                                </MenuItem>
                                <MenuItem
                                    value={'custom'}
                                    key={'customRange'}
                                    disabled={isTimeSeriesNonCumulative}
                                >
                                    Custom Range
                                </MenuItem>
                            </Select>
                        </StyledDropDown>
                        <br />
                        <BinsContainer
                            id="binModeSwitch"
                            disabled={
                                isTimeSeriesNonCumulative || mapType === 'lisa'
                            }
                        >
                            <Switch
                                checked={binMode === 'dynamic'}
                                onChange={handleSwitch}
                                name="bin chart switch"
                            />
                            <p>
                                {binMode === 'dynamic'
                                    ? 'Dynamic'
                                    : 'Fixed Bins'}
                                <Tooltip id="BinModes" />
                            </p>
                        </BinsContainer>
                    </DateSelectorContainer>
                    <Gutter h={35} />

                    <StyledDropDown
                        id="geographySelect"
                        style={{ marginRight: '20px' }}
                    >
                        <InputLabel htmlFor="geographySelect">
                            Geography
                        </InputLabel>
                        <Select
                            value={currentPreset.geography}
                            onChange={handleGeography}
                        >
                            {allGeographies.map((geography) => (
                                <MenuItem
                                    value={geography}
                                    key={geography}
                                    disabled={
                                        !variableTree[
                                            variableName
                                        ].hasOwnProperty(geography)
                                    }
                                >
                                    {geography}
                                </MenuItem>
                            ))}
                        </Select>
                    </StyledDropDown>
                    <StyledDropDown id="datasetSelect">
                        <InputLabel htmlFor="datasetSelect">
                            Data Source
                        </InputLabel>
                        <Select value={dataName} onChange={handleDataset}>
                            {allDatasets.map((dataset) => (
                                <MenuItem
                                    value={dataset}
                                    key={dataset}
                                    disabled={
                                        variableTree[variableName][
                                            currentPreset.geography
                                        ] === undefined ||
                                        variableTree[variableName][
                                            currentPreset.geography
                                        ].indexOf(dataset) === -1
                                    }
                                >
                                    {dataset}
                                </MenuItem>
                            ))}
                        </Select>
                    </StyledDropDown>
                    <Gutter h={35} />
                    <StyledDropDown component="Radio" id="mapType">
                        <FormLabel component="legend">Map Type</FormLabel>
                        <RadioGroup
                            aria-label="maptype"
                            name="maptype1"
                            onChange={handleMapType}
                            value={mapType}
                            className="radioContainer"
                        >
                            <FormControlLabel
                                value="natural_breaks"
                                key="natural_breaks"
                                control={<Radio />}
                                label="Natural Breaks"
                            />
                            <Tooltip id="NaturalBreaks" />
                            <br />
                            <FormControlLabel
                                value="hinge15_breaks"
                                key="hinge15_breaks"
                                control={<Radio />}
                                label="Box Map"
                            />
                            <Tooltip id="BoxMap" />
                            <br />
                            <FormControlLabel
                                value="lisa"
                                key="lisa"
                                control={<Radio />}
                                label="Hotspot"
                            />
                            <Tooltip id="Hotspot" />
                            <br />
                        </RadioGroup>
                    </StyledDropDown>
                    <Gutter h={15} />
                    <StyledDropDown style={{ minWidth: '100%' }}>
                        <InputLabel htmlFor="viz-type-select">
                            Visualization Type
                        </InputLabel>
                        <Select
                            id="viz-type-select"
                            value={vizType}
                            onChange={handleVizType}
                        >
                            <MenuItem value={'2D'} key={'2D'}>
                                2D
                            </MenuItem>
                            <MenuItem value={'3D'} key={'3D'}>
                                3D
                            </MenuItem>
                            <MenuItem value={'dotDensity'} key={'dotDensity'}>
                                Dasymetric (Dot Density)
                            </MenuItem>
                            <MenuItem value={'cartogram'} key={'cartogram'}>
                                Cartogram
                            </MenuItem>
                        </Select>
                    </StyledDropDown>
                    {vizType === 'dotDensity' && (
                        <DotDensityControlSection isCustom={isCustom} />
                    )}
                    <Gutter h={20} />
                    <TwoUp id="overlaysResources">
                        <StyledDropDown style={{ minWidth: '100%' }}>
                            <InputLabel htmlFor="overlay-select">
                                Overlay
                            </InputLabel>
                            <Select
                                id="overlay-select"
                                value={overlay}
                                onChange={handleMapOverlay}
                            >
                                <MenuItem value="" key={'None'}>
                                    None
                                </MenuItem>
                                <MenuItem value={'stories'} key={'stories'}>
                                    Stories
                                    <Tooltip id="Stories" />
                                </MenuItem>
                                <MenuItem
                                    value={'native_american_reservations'}
                                    key={'native_american_reservations'}
                                >
                                    Native American Reservations
                                </MenuItem>
                                <MenuItem
                                    value={'segregated_cities'}
                                    key={'segregated_cities'}
                                >
                                    Hypersegregated Cities
                                    <Tooltip id="Hypersegregated" />
                                </MenuItem>
                                <MenuItem value={'blackbelt'} key={'blackbelt'}>
                                    Black Belt Counties
                                    <Tooltip id="BlackBelt" />
                                </MenuItem>
                                <MenuItem
                                    value={'uscongress-districts'}
                                    key={'uscongress-districts'}
                                >
                                    US Congressional Districts{' '}
                                    <Tooltip id="USCongress" />
                                </MenuItem>
                                <MenuItem
                                    value={'clicB'}
                                    key={'clicB'}
                                >
                                    Black or African American CLICs
                                    <Tooltip id="CLICs" />
                                </MenuItem>
                                <MenuItem
                                    value={'clicH'}
                                    key={'clicH'}
                                >
                                    Hispanic or Latinx CLICs
                                    <Tooltip id="CLICs" />
                                </MenuItem>
                                <MenuItem
                                    value={'clicW'}
                                    key={'clicW'}
                                >
                                    White CLICs
                                    <Tooltip id="CLICs" />
                                </MenuItem>
                                {/* <MenuItem value={'mobility-county'} key={'mobility-county'}>Mobility Flows (County) WARNING BIG DATA</MenuItem> */}
                            </Select>
                        </StyledDropDown>
                        <Gutter h={20} />
                        <StyledDropDown style={{ minWidth: '100%' }}>
                            <InputLabel htmlFor="resource-select">
                                Resource
                            </InputLabel>
                            <Select
                                id="resource-select"
                                value={resource}
                                onChange={handleMapResource}
                            >
                                <MenuItem value="" key="None">
                                    None
                                </MenuItem>
                                <MenuItem
                                    value={'clinics_hospitals'}
                                    key={'variable1'}
                                >
                                    Clinics and Hospitals
                                    <Tooltip id="ClinicsAndHospitals" />
                                </MenuItem>
                                <MenuItem value={'clinics'} key={'variable2'}>
                                    Clinics
                                    <Tooltip id="Clinics" />
                                </MenuItem>
                                <MenuItem value={'hospitals'} key={'variable3'}>
                                    Hospitals
                                    <Tooltip id="Hospitals" />
                                </MenuItem>
                                <MenuItem
                                    value={'vaccinationSites'}
                                    key={'variable4'}
                                >
                                    Federal Vaccination Sites
                                    <Tooltip id="vaccinationSites" />
                                </MenuItem>
                            </Select>
                        </StyledDropDown>
                    </TwoUp>
                </ControlsContainer>
            )}

            {panelState.variables && (
                <NoteContainer>
                    {/* <h3>Help us improve the Atlas!</h3>
          <p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSf0KdYeVyvwnz0RLnZijY3kdyFe1SwXukPc--a1HFPE1NRxyw/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">Take the Atlas v2 survey here </a>
            or share your thoughts at <a href="mailto:contact@theuscovidatlas.org" target="_blank" rel="noopener noreferrer">contact@theuscovidatlas.org.</a>
          </p>
          <hr></hr> */}
                    <p className="note">
                        Data is updated with freshest available data at 3pm CST
                        daily, at minimum. In case of data discrepancy, local
                        health departments are considered most accurate as per
                        CDC recommendations. More information on{' '}
                        <a href="data">data</a>, <a href="methods">methods</a>,
                        and <a href="FAQ">FAQ</a> at main site.
                    </p>
                    <div className="poweredByGeoda">
                        <a
                            href="https://geodacenter.github.io"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/img/geoda-logo.png`}
                                alt="Geoda Logo"
                            />
                            POWERED BY GEODA
                        </a>
                    </div>
                </NoteContainer>
            )}
        </VariablePanelContainer>
    )
}

export default React.memo(VariablePanel)
