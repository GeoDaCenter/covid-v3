import styled from 'styled-components'
/**
 * Component H3 element for charts
 *
 * @category Components/Layout
 * @example
 *   ;() => <ChartTitle>My cool chart</ChartTitle>
 *
 * @component
 */
export const ChartTitle = styled.h3`
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  padding: 0;
  font-weight: normal;
  margin: 0;
  color: ${(props) => props.color || 'white'};
  width: 100%;
  text-transform: capitalize;
  span {
    max-width: 20ch;
    display: block;
    margin: 0.5em auto;
    font-weight: bold;
    color: ${(props) => props.color || 'white'};
  }
`
