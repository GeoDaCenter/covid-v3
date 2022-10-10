import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styled from 'styled-components'
import Popper from '@mui/material/Popper'

import { tooltipInfo } from '../../config'
import colors from '../../config/colors'
import { paramsSelectors, paramsActions } from '../../stores/paramsStore'
const { selectAnchorEl } = paramsSelectors
const { setAnchorEl } = paramsActions

const TooltipContentDiv = styled(Popper)`
    z-index: 10000;
    max-width: 200px;
    background: none;
    padding: 0;
    margin: 0;
    pointer-events: none;
    div.tooltipContentContainer {
        background: black;
        padding: 10px;
        margin: 0;
        border-radius: 4px;
        color: white;
        // transform:translateX(65%);
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
            0px 8px 10px 1px rgba(0, 0, 0, 0.14),
            0px 3px 14px 2px rgba(0, 0, 0, 0.12);
        pointer-events: all;
        a {
            color: ${colors.yellow};
            text-decoration: none;
        }
    }
`
/**
 * Standalone stateful component that renders the content of the tooltip found
 * in src/Components/Interface/Tooltip.js Does not rely on parent props to
 * optimize re-renders.
 *
 * Can be called anywhere in the app.
 *
 * @category Components/Interface
 * @component
 */
const Popover = () => {
    const dispatch = useDispatch()

    const anchorEl = useSelector(selectAnchorEl)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popper' : undefined

    const handleMouseOver = (event) => {
        dispatch(setAnchorEl(anchorEl))
    }

    const handleMouseLeave = () => {
        dispatch(setAnchorEl(null))
    }

    return (
        <TooltipContentDiv
            id={id}
            open={open}
            anchorEl={anchorEl}
            disablePortal={false}
            // modifiers={{
            //     flip: {
            //         enabled: true,
            //     },
            //     preventOverflow: {
            //         enabled: true,
            //         boundariesElement: 'window',
            //     },
            // }}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <div className="tooltipContentContainer">
                {anchorEl && tooltipInfo[anchorEl.id]}
            </div>
        </TooltipContentDiv>
    )
}

export default Popover
