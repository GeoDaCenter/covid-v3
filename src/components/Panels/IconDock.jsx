import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Icon } from '..'
import colors from '../../config/colors'
import useMediaQuery from '@mui/material/useMediaQuery'
import { paramsSelectors, paramsActions } from '../../stores/paramsStore'
const { selectPanelState } = paramsSelectors
const { togglePanel, toggleMobilePanel } = paramsActions
const DockContainerOuter = styled.div`
    position: relative;
`

const DockContainer = styled.div`
    height: calc(100vh - 50px);
    background: lightgray;
    width: 50px;
    /* position: absolute; */
    /* left: 0; */
    /* top: 0; */
    background: ${colors.gray};
    border-right: 1px solid black;
    display: flex;
    flex-direction: column;
    z-index: 5;
    button {
        background: none;
        border: none;
        width: 100%;
        height: 50px;
        /* padding: 10px 14px; */
        padding: 14px 14px 14px 10px;
        cursor: pointer;
        border-left: 4px solid rgba(0, 0, 0, 0);
        /* border-bottom:2px solid ${colors.gray};
    border-top:2px solid ${colors.gray}; */
        transition: 125ms all;
        @media (max-width: 600px) {
            border-top: 4px solid rgba(0, 0, 0, 0);
            border-left: initial;
            height: auto;
        }
        svg {
            fill: white;
            stroke: white;
            stroke-width: 0;
            transition: 250ms all;
        }
        &.hovered {
            svg {
                fill: ${colors.yellow};
                stroke: ${colors.yellow};
            }
        }
        &.active {
            border-color: ${colors.yellow};
            /* background-color:${colors.yellow}44; */
            @media (max-width: 600px) {
                border-color: ${colors.yellow};
            }
        }
        span.mobileText {
            display: none;
            color: white;
            font-size: 0.75rem;
        }
    }
    #settings-button {
        stroke-width: 2px;
        circle.cls-1 {
            fill: none;
        }
    }
    @media (max-width: 768px) {
        width: 100vw;
        top: 0;
        height: 80px;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;
        /* overflow-y:scroll; */
        ::-webkit-scrollbar {
            width: 10px;
            height: 0.5em;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #2b2b2b;
            height: 1em;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #999;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
            transition: 125ms all;
            height: 1em;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: url('${process.env.PUBLIC_URL}/icons/grip.png'), #f9f9f9;
            background-position: center center;
            background-repeat: no-repeat, no-repeat;
            background-size: 50%, 100%;
        }
        button {
            width: auto;
            text-align: center;
            padding: 0.75em;
            svg {
                width: 1rem;
            }
            span.mobileText {
                display: block;
                font-size: 0.625rem;
            }
        }
    }
`

const DockLabels = styled.div`
    position: fixed;
    left: 50px;
    top: 50px;
    color: red;
    z-index: 5000;
    opacity: 0;
    pointer-events: none;
    transition-delay: 0s;
    transition-duration: 125ms;
    transition-property: opacity;
    background: ${colors.darkgray}dd;
    display: flex;
    flex-direction: column;
    button {
        padding: 10px;
        color: white;
        background: none;
        height: 50px;
        border: none;
        text-align: left;
        transition: 250ms all;
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        &.hovered {
            color: ${colors.yellow};
        }
    }
    &.active {
        opacity: 1;
        pointer-events: initial;
        transition-delay: 0.3s;
        transition-duration: 250ms;
    }
    @media (max-width: 768px) {
        display: none;
    }
`

const buttons = [
    {
        symbol: 'settings',
        id: 'settings-button',
        ariaLabel: 'Data & Variables',
        panelName: 'variables',
    },
    {
        symbol: 'summary',
        id: 'summary-button',
        ariaLabel: 'Community Data',
        panelName: 'info',
    },
    {
        symbol: 'lineChart',
        id: 'lineChart-button',
        ariaLabel: 'Line Chart',
        panelName: 'lineChart',
    },
    // {
    //   symbol: 'scatterChart',
    //   id: 'scatterPlot-button',
    //   ariaLabel: 'Scatterplot Chart',
    //   panelName: 'scatterChart',
    // },
    {
        symbol: 'addData',
        id: 'add-data-button',
        ariaLabel: 'Add Custom Data',
        panelName: 'dataLoader',
    },
    {
        symbol: 'report',
        id: 'report-button',
        ariaLabel: 'Report Builder',
        panelName: 'reportBuilder',
    },
    {
        symbol: 'story',
        id: 'stories-button',
        ariaLabel: 'Stories',
        panelName: 'storiesPane',
    },
    // {
    //   symbol: 'sliders',
    //   id: 'user-preferences-button',
    //   ariaLabel: 'User Preferences',
    //   panelName: 'preferences',
    // },
    {
        symbol: 'info',
        id: 'info-button',
        ariaLabel: 'Information',
        panelName: 'tutorial',
    },
]

/**
 * Icon dock for different panels available. Manages `panelState` property of
 * paramSlice
 *
 * @category Components/Map
 * @component
 */
function IconDock() {
    const dispatch = useDispatch()
    const [hoveredIcon, setHoveredIcon] = useState(null)
    const panelState = useSelector(selectPanelState)
    const isMobile = useMediaQuery('(max-width:600px)')
    const handleToggle = isMobile
        ? (panel) => dispatch(toggleMobilePanel(panel))
        : (panel) => dispatch(togglePanel(panel))

    return (
        <DockContainerOuter>
            <DockContainer>
                {buttons.map(({ symbol, id, ariaLabel, panelName }) => (
                    <button
                        id={id}
                        key={`${id}-icon-dock`}
                        aria-label={ariaLabel}
                        onClick={() => handleToggle(panelName)}
                        className={`${hoveredIcon === id && 'hovered '}${
                            panelState[panelName] && ' active'
                        }`}
                        onMouseEnter={() => setHoveredIcon(id)}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        <Icon symbol={symbol} />
                        <span className="mobileText">{ariaLabel}</span>
                    </button>
                ))}
            </DockContainer>
            <DockLabels className={hoveredIcon ? 'active' : ''}>
                {buttons.map(({ symbol, id, ariaLabel, onClick }) => (
                    <button
                        id={id}
                        key={`${id}-icon-dock-label`}
                        aria-label={ariaLabel}
                        onClick={onClick}
                        className={hoveredIcon === id ? 'hovered' : ''}
                        onMouseEnter={() => setHoveredIcon(id)}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        {ariaLabel}
                    </button>
                ))}
            </DockLabels>
        </DockContainerOuter>
    )
}

export default React.memo(IconDock)
