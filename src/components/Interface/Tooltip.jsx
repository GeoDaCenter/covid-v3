import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { paramsActions } from '../../stores/paramsStore'
const { setAnchorEl } = paramsActions
const TooltipContainer = styled.button`
    width: 12.5px;
    height: 12.5px;
    background: url('${process.env.PUBLIC_URL}/assets/img/info.png');
    background-repeat: no-repeat;
    background-size: cover;
    outline: none;
    border: none;
    padding: 0;
    margin: 4px;
    transform: translateY(4px);
    display: inline-grid;
`
/**
 * A tooltip component that displays a tooltip when hovered over.
 *
 * @category Components/Interface
 * @example
 *     function ExampleComponent() {
 *     return (
 *     <Tooltip id="exampleTooltip" />
 *     )
 *
 * @param {Object} props
 * @param {string} id Id of the tooltip content, referenced from `tooltipInfo`
 *   in src/config/index.js
 * @component
 */
const Tooltip = ({ id }) => {
    const dispatch = useDispatch()

    const handleMouseOver = (event) => {
        dispatch(setAnchorEl(event.currentTarget))
    }

    const handleMouseLeave = () => {
        dispatch(setAnchorEl(null))
    }

    return (
        <TooltipContainer
            id={id}
            key={id}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        />
    )
}

export default Tooltip
