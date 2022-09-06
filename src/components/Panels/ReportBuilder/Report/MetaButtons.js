import { Pagination } from "@mui/material";
import styled from "styled-components";
import colors from "../../../../config/colors";

export const MetaButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;
export const MetaButton = styled.button`
  background: rgba(0,0,0,0);
  color: ${(props) => (props.reset ? colors.strongOrange : "white")};
  padding: 0.5em;
  border:none;
  cursor: pointer;
  transition: 250ms background;
  border-radius: 0.5em;
  &:hover {
    background: ${colors.yellow}55;
  }
`;

export const StyledPagination = styled(Pagination)`
  button.Mui-selected {
    background-color: ${colors.strongOrange}88;
    font-weight: bold;
  }
`