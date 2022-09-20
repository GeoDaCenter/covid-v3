import styled from 'styled-components';
/**
 * Helper component for vertical spacing
 * 
 * @component
 * @category Components/layout
 * @param {number} h - The size of the gutter in px
 * @returns {React.Component}
 */
export const Gutter = styled.div`
  width: 100%;
  display: block;
  height: ${(props) => props.h}px;
`;