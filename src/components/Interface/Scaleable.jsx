import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Icon from './Icon'
import styled from 'styled-components'

const ResizeButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: none;
  border: none;
  transform: rotate(90deg);
  cursor: nw-resize;
  display: ${({ notScaleable }) => (notScaleable ? 'none' : 'initial')};
  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: white;
  }
`

/**
 * A wrapper component that allows the children to be resized Children should be
 * responsive to the parent size. Often composed with Draggable
 *
 * @category Components
 * @example
 *   function MyComponent() {
 *   return (
 *   <Scaleable title="myPanel" defaultHeight={100} defaultWidth={100}>
 *   <div>My panel content</div>
 *   </Scaleable>
 *
 *   )
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the panel
 * @param {String} props.title - The id of the panel in the store
 * @param {Boolean} props.notScaleable - If true, disables scaling
 * @param {number} props.defaultHeight - Default height of the panel
 * @param {number} props.defaultWidth - Default width of the panel
 * @param {number} props.minHeight - Minimum height of the panel
 * @param {number} props.minWidth - Minimum width of the panel
 * @component
 */
const Scaleable = ({
  defaultHeight,
  defaultWidth,
  minHeight,
  minWidth,
  title,
  children,
  notScaleable,
}) => {
  const [width, setWidth] = useState(defaultWidth)
  const [height, setHeight] = useState(defaultHeight)
  const [currXYPos, setCurrXYPos] = useState(false)

  const listener = (e) => {
    const divider = e?.view?.devicePixelRatio || 1
    setWidth((prevWidth) => prevWidth + e.movementX / divider)
    setHeight((prevHeight) => prevHeight + e.movementY / divider)
  }

  const touchListener = (e) => {
    setWidth((prev) => e?.targetTouches[0]?.clientX - currXYPos[0] || prev)
    setHeight((prev) => e?.targetTouches[0]?.clientY - currXYPos[1] || prev)
  }

  const removeListener = () => {
    window.removeEventListener('mousemove', listener)
    window.removeEventListener('mouseup', removeListener)
  }

  const removeTouchListener = () => {
    window.removeEventListener('touchmove', touchListener)
    window.removeEventListener('touchend', removeTouchListener)
  }

  const handleDown = () => {
    window.addEventListener('mousemove', listener)
    window.addEventListener('mouseup', removeListener)
  }

  const handleTouch = (e) => {
    setCurrXYPos([
      +e.target.parentNode.parentNode.parentNode.style.left.slice(0, -2),
      +e.target.parentNode.parentNode.parentNode.style.top.slice(0, -2),
    ])
    window.addEventListener('touchmove', touchListener)
    window.addEventListener('touchend', removeTouchListener)
  }

  const open = useSelector(({ ui }) => ui.panelState[title])

  useEffect(() => {
    setWidth(defaultWidth)
    setHeight(defaultHeight)
  }, [open, defaultHeight, defaultWidth])

  return (
    <div
      style={{
        width: width,
        height: height,
        minHeight: minHeight,
        minWidth: minWidth,
      }}
    >
      {children}
      <ResizeButton
        id="resize"
        notScaleable={notScaleable}
        onMouseDown={handleDown}
        onTouchStart={handleTouch}
        style={{ zIndex: 10 }}
      >
        <Icon symbol="resize" />
      </ResizeButton>
    </div>
  )
}

export default Scaleable
