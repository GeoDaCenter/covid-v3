import styled from "styled-components";
import colors from '../../../config/colors';

export const FormButton = styled.button`
  padding: 0.5em;
  border: 1px solid ${colors.white};
  background: ${(props) => (props.active ? colors.white : colors.gray)};
  color: ${(props) => (props.active ? colors.gray : colors.white)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin: 0.5em 0.5em 0.5em 0;
  opacity: ${(props) => (props.disabled ? 0.25 : 1)};
`;
