import styled from "styled-components";
import colors from "../../config/colors";

export const MdxStylesWrapper = styled.div`
  ol {
    list-style: none;
    counter-reset: item;
    margin: 0.5rem 0 0.5rem 0.5rem;
  }

  ol li {
    position: relative;
    counter-increment: item;
    padding: 0 0 1rem 0.5rem;
  }

  ol li:before {
    position: absolute;
    content: counter(item);
    width: 1.75rem;
    height: 1.75rem;
    left: -1.75rem;
    top: 0;
    background: ${colors.teal};
    color: white;
    text-align: center;
    border-radius: 50%;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
    transform: translateY(25%);
  }

  table,
  th,
  td {
    border: 1px solid;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 0.25em 0.5em;
  }
  p {
    margin-bottom: 1rem;
  }
  .cls-1 {
    stroke: black;
    stroke-width: 6px;
    fill: none;
  }
  img {
    max-width: 100%;
    width: 100%;
  }
`;