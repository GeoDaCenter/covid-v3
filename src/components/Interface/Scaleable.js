import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import styled from 'styled-components';

const ResizeButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: none;
  border: none;
  transform: rotate(90deg);
  cursor: nw-resize;
  display: ${(props) => (props.notScaleable ? 'none' : 'initial')};
  svg {
    width:1.25rem;
    height:1.25rem;
    fill:white;
  }
`;

const Scaleable = (props) => {
  const [width, setWidth] = useState(props.defaultWidth);
  const [height, setHeight] = useState(props.defaultHeight);
  const [currXYPos, setCurrXYPos] = useState(false);

  const listener = (e) => {
    setWidth((prevWidth) => prevWidth + e.movementX);
    setHeight((prevHeight) => prevHeight + e.movementY);
  };

  const touchListener = (e) => {
    setWidth((prev) => e?.targetTouches[0]?.clientX - currXYPos[0] || prev);
    setHeight((prev) => e?.targetTouches[0]?.clientY - currXYPos[1] || prev);
  };

  const removeListener = () => {
    window.removeEventListener('mousemove', listener);
    window.removeEventListener('mouseup', removeListener);
  };

  const removeTouchListener = () => {
    window.removeEventListener('touchmove', touchListener);
    window.removeEventListener('touchend', removeTouchListener);
  };

  const handleDown = () => {
    window.addEventListener('mousemove', listener);
    window.addEventListener('mouseup', removeListener);
  };

  const handleTouch = (e) => {
    setCurrXYPos([
      +e.target.parentNode.parentNode.parentNode.style.left.slice(0, -2),
      +e.target.parentNode.parentNode.parentNode.style.top.slice(0, -2),
    ]);
    window.addEventListener('touchmove', touchListener);
    window.addEventListener('touchend', removeTouchListener);
  };

  const open = useSelector(({ui}) => ui.panelState[props.title]);

  useEffect(() => {
    setWidth(props.defaultWidth);
    setHeight(props.defaultHeight);
  }, [open, props.defaultHeight, props.defaultWidth]);

  return (
    <div
      style={{
        width: width,
        height: height,
        minHeight: props.minHeight,
        minWidth: props.minWidth,
      }}
    >
      {props.content}
      <ResizeButton
        // id="resize"
        notScaleable={props.notScaleable}
        onMouseDown={handleDown}
        onTouchStart={handleTouch}
        style={{ zIndex: 10 }}
        aria-label="Resize Panel"
      >
        <Icon symbol="resize" />      
      </ResizeButton>
    </div>
  );
};

export default Scaleable;
