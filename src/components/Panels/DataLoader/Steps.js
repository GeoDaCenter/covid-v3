import React from 'react';
import styled from 'styled-components';

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { FormButton } from "./FormButton";
import colors from '../../../config/colors';

const StyledStepper = styled(Stepper)`
  &.MuiPaper-root {
    background: none;
    .MuiSvgIcon-root {
      circle {
        color: ${colors.darkgray};
      }
    }

    .MuiStepIcon-active {
      circle {
        color: ${colors.yellow};
      }
      text {
        fill: ${colors.darkgray};
      }
    }
    .MuiStepLabel-label {
      color: ${colors.white};
    }
    .MuiStepIcon-completed,
    .MuiStepLabel-completed {
      color: ${colors.skyblue};
    }
  }
`;

const StepperButton = styled(FormButton)`
  color: ${(props) => (props.back ? colors.yellow : colors.darkgray)};
  background: ${(props) => (props.back ? colors.gray : colors.yellow)};
  border: 1px solid ${colors.yellow};
`;

export const Steps = ({ activeStep, steps }) => (
  <>
    <StyledStepper activeStep={activeStep}>
      {steps.map((label) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </StyledStepper>
  </>
);

export const StepButtons = ({ activeStep, setActiveStep, currentGeojson, steps }) => (
  <>
    <StepperButton
      onClick={() => setActiveStep((prev) => prev - 1)}
      back
      disabled={activeStep === 0}
    >
      Back
    </StepperButton>
    <StepperButton
      onClick={() => setActiveStep((prev) => prev + 1)}
      disabled={
        activeStep === steps.length - 1 || currentGeojson.columns === undefined
      }
    >
      Next
    </StepperButton>
  </>
);
