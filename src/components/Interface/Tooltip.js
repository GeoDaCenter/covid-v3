import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setAnchorEl } from '../../actions';

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
`;

const Tooltip = ({id}) => {
  const dispatch = useDispatch();

  const handleMouseOver = (event) => {
    dispatch(setAnchorEl(event.currentTarget));
  };

  const handleMouseLeave = () => {
    dispatch(setAnchorEl(null));
  };

  return (
    <TooltipContainer
      id={id}
      key={id}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseOver}
      onBlur={handleMouseLeave}
      aria-label="Open tooltip"
    />
  );
};

export default Tooltip;
