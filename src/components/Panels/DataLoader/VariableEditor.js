import React, { useState } from "react";

import styled from "styled-components";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { StyledDropDown, Gutter } from "../..";
import { HelperText } from "./HelperText";
import colors from "../../../config/colors";
import { colorScales } from "../../../config/scales";
import { FormButton } from "./FormButton";
const ModalInner = styled.div`
  margin:0 auto;
  max-width:fit-content;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 'fit-content',
  bgcolor: colors.gray,
  border: "1px solid #000",
  fontFamily: "'Lato', sans-serif",
  color: "white",
  boxShadow: 0,
  p: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 4,
    xl: 4,
  },
};

const ColorBarContainer = styled.span`
  display: flex;
  width: 100%;
  span {
    height: 10px;
    flex: 1;
  }
`;

export const VariableTextField = styled(TextField)`
  &.MuiFormControl-root {
    /* margin-top: -1em; */
    /* border-bottom: 1px solid white; */
  }
  label {
    color: white;
  }
  fieldset {
    color: white;
    border-color: white;
  }
`;

const VariableLabel = styled.p`
  color: white;
  margin-bottom: 0;
`;

const ColorBar = ({ colors }) => (
  <ColorBarContainer>
    {colors.map((color) => (
      <span style={{ background: `rgb(${color.join(",")})` }}>&nbsp;</span>
    ))}
  </ColorBarContainer>
);

export const VariableEditor = ({
  fileName,
  columns,
  variables,
  setVariables,
  handleClose,
  idx,
}) => {
  const [variableInfo, setVariableInfo] = useState(
    idx !== false
      ? variables[idx]
      : {
          nProperty: columns[0],
          dProperty: "NULL",
        }
  );

  const handleProperty = (property, value) => {
    setVariableInfo((prev) => {
      return {
        ...prev,
        [property]: value,
      };
    });
  };

  const handleSave = () => {
    const fullSpec = {
      variableName:
        variableInfo.variableName || `${fileName}-${variables.length + 1}`,
      numerator: "properties",
      nType: "characteristic",
      nRange: null,
      nIndex: null,
      nProperty: variableInfo.nProperty,
      denominator: "properties",
      dType: variableInfo.dProperty === "NULL" ? null : "characteristic",
      dProperty:
        variableInfo.dProperty === "NULL" ? null : variableInfo.dProperty,
      dRange: null,
      dIndex: null,
      scale: 1 || variableInfo.scale,
      scale3D: 1000 || variableInfo.scale3D,
      fixedScale: null,
      colorScale: null || variableInfo.colorScale,
      dataNote: null,
    };
    if (idx !== false) {
      setVariables((prev) => {
        prev[idx] = fullSpec;
        return prev;
      });
      handleClose();
    } else {
      setVariables((prev) => {
        let newArray = [...prev];
        newArray.unshift(fullSpec);
        return newArray;
      });
      handleClose();
    }
  };

  const colors8 = [
    "natural_breaks",
    "mobilityWork",
    "BuPu8",
    "purpleSingleHue8",
    "YlGnBu8",
    "YlGn8",
    "greenSingleHue8",
    "mobilityDivergingHome",
    "mobilityDivergingWork",
  ];

  return (
    <Modal open={true} onClose={handleClose}>
      <Box sx={style}>
        <ModalInner>
          <h3>Variable Editor</h3>
          <Gutter h={15} />
          <p>Fill out the form below to add a new variable.</p>
          <Gutter h={15} />

          <VariableTextField
            fullWidth
            required
            id="variableName"
            label="Variable Name"
            onChange={(event) =>
              handleProperty("variableName", event.target.value)
            }
            aria-describedby="variable-name-helper"
            value={variableInfo.variableName}
          />
          <HelperText id="variable-name-helper">
            What your variable should be called.
          </HelperText>
          <Gutter h={30} />

          <StyledDropDown 
            id="numerSelect" 
            fullWidth
          >
            <InputLabel htmlFor="numerSelect" required>
              Numerator Column
            </InputLabel>
            <Select
              required
              value={variableInfo.nProperty}
              onChange={(event) =>
                handleProperty("nProperty", event.target.value)
              }
              aria-describedby="numer-name-helper"
            >
              {columns.map((col) => (
                <MenuItem value={col} key={"numer-select-" + col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </StyledDropDown>
          <HelperText id="numer-name-helper">
            The column for your variable.
            <br />
            If you want to normalize your data, the top of your expression.
          </HelperText>
          <Gutter h={30} />

          <StyledDropDown 
            id="denomSelect"
            fullWidth
            >
            <InputLabel htmlFor="denomSelect">
              Denominator Column (Optional)
            </InputLabel>
            <Select
              value={variableInfo.dProperty}
              onChange={(event) =>
                handleProperty("dProperty", event.target.value)
              }
              aria-describedby="denom-name-helper"
            >
              <MenuItem value={"NULL"} key={"denom-select-null"}>
                No denominator
              </MenuItem>
              {columns.map((col) => (
                <MenuItem value={col} key={"denom-select-" + col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </StyledDropDown>
          <HelperText id="denom-name-helper">
            If normalizing, the bottom of your expression.
          </HelperText>

          <Gutter h={30} />

          <StyledDropDown 
            id="colorScaleSelect"
            fullWidth
            >
            <InputLabel htmlFor="colorScaleSelect">Color Scale</InputLabel>
            <Select
              value={variableInfo.colorScale}
              onChange={(event) =>
                handleProperty("colorScale", event.target.value)
              }
            >
              {colors8.map((scheme) => (
                <MenuItem value={scheme} key={"color-select-" + scheme}>
                  <ColorBar colors={colorScales[scheme].slice(1)} />
                </MenuItem>
              ))}
            </Select>
          </StyledDropDown>
          <Gutter h={30} />

          {/* <VariableLabel htmlFor="colorScaleSelect">Variable Scale</VariableLabel>
              <VariableTextField 
                  id="standard-basic" 
                  label="Variable Scale" 
                  onChange={(event) => handleProperty('scale', event.target.value)}
                  type="number"
                  value={variableInfo.scale}
              />
              <Gutter h={30} />
  
              <VariableLabel htmlFor="colorScaleSelect">3D Scale</VariableLabel>
              <VariableTextField 
                  id="standard-basic" 
                  label="Variable Scale" 
                  onChange={(event) => handleProperty('scale3D', event.target.value)}
                  type="number"
                  value={variableInfo.scale3D}
              /> */}
          {/* <Gutter h={15} /> */}

          <FormButton onClick={handleSave}>Save Variable</FormButton>
        </ModalInner>
      </Box>
    </Modal>
  );
};
