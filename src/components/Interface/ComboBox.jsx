import * as React from "react";
import TextField from "@mui/material/TextField";
import { Popper } from "@mui/material";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import styled from "styled-components";
import colors from "../../config/colors";

/**
 * Styles for popper aka tooltip component for autocomplete
 * @component
 */
const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    background: colors.darkgray,
    height: 200,
    overflowY: "scroll",
    "& ul": {
      padding: 0,
      height: 200,
      margin: 0,
      background: "none",
      li: {
        background: "none",
        color: "white",
      },
    },
  },
});


/**
 * Styles for the autcomplete compnent
 * @component
 */
 const StyledAutoComplete = styled(Autocomplete)`
 margin-top: 1em;
 label.MuiInputLabel-root {
   color: ${colors.white};
 }
 fieldset.MuiOutlinedInput-notchedOutline {
   border-color: ${colors.white};
 }
 div.MuiAutocomplete-endAdornment button svg {
   fill: ${colors.white};
 }
 div.MuiAutocomplete-popper {
   display: none;
 }
`;


/**
 * Component for searchable autocomplete
 * @component
 * 
 * @param {Object} props
 * @param {array} props.options List of option objects {label: string, value: any}[]
 * @param {Object} props.value Selected value {label: string, value: any} | null
 * @param {function} props.setValue function (value: any) => void 
 * @param {string} props.label Text label
 * @param {string} props.id id passed to DOM
 * 
 * @example 
 * <ComboBox
 *   options={[
 *     { label: "Option 1", value: 1 },
 *     { label: "Option 2", value: 2 },
 *   ]}
 *   value={{
 *     label: "Option 1",
 *     value: 1,
 *   }}
 *   setValue={(val) => setValue(val)}
 *   label={'Select an option'}
 *   id={'select'}
 * />
 */
function ComboBox({
  options = [],
  value = {},
  setValue = () => {},
  id = "combo-box",
  label = "Combo Box",
}) {
  return (
    <StyledAutoComplete
      disablePortal
      id={id}
      options={options}
      value={value?.label}
      onChange={(_event, newValue) => setValue(newValue)}
      PopperComponent={StyledPopper}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />
      )}
    />
  );
}

export default ComboBox;