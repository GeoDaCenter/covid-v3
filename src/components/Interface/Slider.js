import React from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { setVariableParams } from "../../actions";
import useTickUpdate from "../../hooks/useTickUpdate";
import colors from "../../config/colors";
import { debounce, findClosestValue } from "../../utils";
import useCurrentDateIndices from "../../hooks/useCurrentDateIndices";
import Ticks from "./Ticks";
import DatePicker from "react-date-picker";
import {
  StyledSlider,
  Icon
} from '../../components'

const SliderContainer = styled(Grid)`
  color: white;
  box-sizing: border-box;
  padding: 0 0.5em 0.5em 0.5em;
  width: 100%;
  user-select: none;
`;
const DateContainer = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 0.75rem;
    text-align: center;
  }
`;

const PlayPauseButton = styled(Button)`
  background: none;
  padding: 0;
  margin: 0;
  width: 100%;
  width:50px;
  height:50px;
  &.MuiButton-root {
    min-width: auto;
    max-width: 40px;
    span {
      width: 100%;
    }
  }
  svg {
    fill: white;
  }
`;

const SliderAndTicksContainer = styled.div`
  position: relative;
  margin: 0 1em;
  transform: translateY(3px);
`;

const SliderAndTicksInner = styled.div``;



const SpeedSlider = styled.div`
  position: absolute;
  padding: 1em 2em 0 1em!important;
  width: 15%;
  min-width:100px;
  max-width:150px;
  background: ${colors.gray};
  left: 0;
  top: calc(100% + 0.25em);
  /* box-shadow: 0px 0px 5px rgb(0 0 0 / 70%); */
  p {
    text-align: center;
  }
  span.MuiSlider-rail {
    display: initial !important;
  }
  span.MuiSlider-track {
    display: initial !important;
  }
  span.MuiSlider-thumbColorPrimary {
    transform:translateY(-7px) !important;
  }
`;

const RangeSlider = styled(Slider)`
  box-sizing: border-box;
  &.MuiSlider-root {
    box-sizing: border-box;
    color: #ffffff55;
  }
  // span.MuiSlider-rail {
  //   color: white;
  //   height: 4px;
  //   display: none;
  // }
  span.MuiSlider-track {
    color: ${colors.yellow};
    height: 4px;
    opacity: 0.5;
    transform: translateY(1px);
  }
  span.MuiSlider-thumb {
    color: white;
    width: 15px;
    height: 15px;
    transform: translate(-1.5px, -4px);
    border: 2px solid ${colors.gray};
    .MuiSlider-valueLabel {
      transform: translateY(-10px);
      pointer-events: none;
      font-size: 15px;
      span {
        background: none;
      }
    }
  }
  span.MuiSlider-mark {
    width: 1px;
    height: 2px;
  }
  span.muislider-thumb.muislider-active:hover {
    box-shadow: 0px 0px 10px rgba(200, 200, 200, 0.5);
  }
`;

const DateSelectorContainer = styled(Grid)`
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  .MuiFormControl-root {
    padding: 0 0 0 20px !important;
  }
  span {
    font-weight: bold;
  }
  #dateSelector {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @media (max-width: 600px) {
      transform: none;
      left: 20px;
    }
    @media (max-width: 450px) {
      transform: none;
      left: 0px;
    }
  }
  .react-date-picker {
    /* display: block;
    margin:0 auto; */
    color: white;
    padding: 0.5em 0 0 0;
  }
  .react-date-picker__inputGroup__input,
  span {
    color: white;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Lato", sans-serif;
  }
  .react-date-picker__clear-button {
    display: none;
  }
  svg rect,
  svg line {
    stroke: white;
  }
  .react-calendar {
    background: ${colors.darkgray};
    transform: translate(-33.33%, 0.5em);
    button {
      color: white;
      background: none;
      transition: 250ms all;
      &:disabled {
        opacity: 0.05;
      }
      &:hover {
        background: none;
        color: ${colors.yellow};
      }
      &.react-calendar__month-view__days__day--neighboringMonth {
        opacity: 0.5;
        &:disabled {
          opacity: 0.05;
        }
      }
    }
  }
  p {
    padding: 4px 1em 0 1em;
    font-size: 1rem;
  }
`;

const valuetext = (dates, value) => {
  const fullDate = dates[value]?.split("-");

  return fullDate && `${parseInt(fullDate[1])}/${fullDate[0]?.slice(2)}`;
};

const speedtext = (value) => `Animation Tick Rate: ${value} milliseconds`;

function DateTitle({
  dates = [],
  currDatesAvailable = [],
  currIndex = 7,
  currRange = 7,
  rangeType = "",
  handleChange = () => { },
  handleRangeChange = () => { },
}) {
  if (!dates || !dates.length) {
    return null;
  }

  const currDate = new Date(dates[currIndex + 1] || "2020-01-01");
  const currStartDate = new Date(
    dates[currIndex - currRange + 1] || "2020-01-01"
  );
  const firstDateIdx = currDatesAvailable.indexOf(1);
  const lastDateIdx = [...currDatesAvailable].reverse().indexOf(1);
  const minDate = new Date(dates[firstDateIdx] || "2020-01-01");
  const maxDate = new Date(dates.slice(-lastDateIdx)[0] || "");

  const onChange =
    rangeType === "custom"
      ? (date, position) => {
        try {
          const dateString = JSON.stringify(date).slice(1, 11);
          const dateIdx = dates.indexOf(dateString);
          if (position === "start") {
            handleRangeChange(null, [dateIdx, currIndex]);
          } else {
            handleRangeChange(null, [currIndex - currRange, dateIdx]);
          }
        } catch (error) {
          console.log(error);
        }
      }
      : (date) => {
        try {
          const dateString = JSON.stringify(date).slice(1, 11);
          const dateIdx = dates.indexOf(dateString);
          handleChange(null, dateIdx);
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <DateSelectorContainer item xs={12}>
      {rangeType === "custom" && (
        <DatePicker
          calendarAriaLabel="Toggle calendar"
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          monthAriaLabel="Month"
          minDate={minDate}
          maxDate={maxDate}
          nativeInputAriaLabel="Date"
          onChange={onChange}
          value={currStartDate}
          yearAriaLabel="Year"
        />
      )}

      {rangeType === "custom" && <p>to</p>}
      <DatePicker
        calendarAriaLabel="Toggle calendar"
        clearAriaLabel="Clear value"
        dayAriaLabel="Day"
        monthAriaLabel="Month"
        minDate={minDate}
        maxDate={maxDate}
        nativeInputAriaLabel="Date"
        onChange={onChange}
        value={currDate}
        yearAriaLabel="Year"
      />
      {/* <DateH3>
        {rangeType === 'custom' && dates && dates.length && currIndex-currRange !== undefined ? `${formatDate(dates[currIndex-currRange])} to ` : ""}
        {(dates && dates.length && currIndex !== undefined) ? formatDate(dates[currIndex]) : ""}
      </DateH3> */}
    </DateSelectorContainer>
  );
}

const findLastDate = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === 1) {
      return i;
    }
  }
};
function DateSlider() {
  const dispatch = useDispatch();
  const [
    currIndex,
    currDates,
    currDatesAvailable,
    allDates,
    currRange,
    rangeType,
  ] = useCurrentDateIndices();
  const [isTicking, setIsTicking, timing, setTiming] = useTickUpdate({
    currDatesAvailable,
  });

  const handleChange = debounce((_, newValue) => {
    // eslint-disable-line
    if (currDatesAvailable[newValue]) {
      dispatch(setVariableParams({ nIndex: newValue }));
    } else {
      dispatch(
        setVariableParams({
          nIndex: findClosestValue(
            newValue,
            currDatesAvailable,
            newValue < currIndex
          ),
        })
      );
    }
  }, 5);

  const handleRangeChange = debounce((_, newValue) => {
    const newIndex = Math.max(newValue[0], newValue[1]);
    const newRange = newIndex - Math.min(newValue[0], newValue[1]); // eslint-disable-line
    if (currDatesAvailable[newIndex]) {
      dispatch(setVariableParams({ nIndex: newIndex, nRange: newRange }));
    } else {
      dispatch(
        setVariableParams({
          nIndex: findClosestValue(
            newIndex,
            currDatesAvailable,
            newIndex < currIndex
          ),
          nRange: newRange,
        })
      );
    }
  }, 25);

  const handlePlayPause = () => {
    if (!isTicking) {
      setIsTicking(true);
    } else {
      setIsTicking(false);
    }
  };

  const shouldShowLineSlider = rangeType !== "custom";
  const shouldShowRangeSlider = rangeType === "custom";
  return (
    <SliderContainer container spacing={0}>
      <DateTitle
        currIndex={currIndex}
        currRange={currRange}
        rangeType={rangeType}
        dates={allDates}
        handleChange={handleChange}
        handleRangeChange={handleRangeChange}
        currDatesAvailable={currDatesAvailable}
      />
      <Grid item xs={1} md={1} lg={1} xl={1}>
        <PlayPauseButton id="playPause" onClick={() => handlePlayPause()}>
          <Icon symbol={isTicking ? "pause" : "play"} />
        </PlayPauseButton>
      </Grid>
      <DateContainer
        item
        xs={1}
        md={1}
        lg={1}
        xl={1}
        style={{ textAlign: "right" }}
      >
        <p>{valuetext(allDates, 0)}</p>
      </DateContainer>
      <Grid item xs={9} md={9}>
        <SliderAndTicksContainer>
          <SliderAndTicksInner>
            <Ticks
              id="ticks"
              loaded={currDates}
              available={currDatesAvailable}
              fullLength={allDates.length}
            />
          </SliderAndTicksInner>
          <SliderAndTicksInner>
            {shouldShowLineSlider && (
              <StyledSlider
                id="timeSlider"
                value={currIndex}
                // valueLabelDisplay="on"
                onChange={handleChange}
                getAriaValueText={valuetext}
                valueLabelFormat={valuetext}
                aria-labelledby="aria-valuetext"
                min={0}
                max={allDates.length}
                step={1}
              />
            )}
            {shouldShowRangeSlider && (
              <RangeSlider
                id="timeSlider"
                value={[currIndex - currRange, currIndex]}
                onChange={handleRangeChange}
                getAriaValueText={valuetext}
                valueLabelFormat={valuetext}
                aria-labelledby="aria-valuetext"
                min={0}
                max={allDates.length}
                step={1}
              />
            )}
          </SliderAndTicksInner>
        </SliderAndTicksContainer>
      </Grid>
      <DateContainer item xs={1} md={1} style={{ textAlign: "left" }}>
        <p>{valuetext(allDates, findLastDate(currDatesAvailable))}</p>
      </DateContainer>
      {!!isTicking && (
        <SpeedSlider>
          <p>Animation Speed</p>
          <StyledSlider
            value={1000 - timing}
            onChange={(e, newValue) => setTiming(1000 - newValue)}
            getAriaValueText={speedtext}
            valueLabelFormat={speedtext}
            aria-labelledby="aria-valuetext"
            min={25}
            max={975}
            step={25}
          />
        </SpeedSlider>
      )}
    </SliderContainer>
  );
  // } else {
  //   return null
  // }
}

export default React.memo(DateSlider);
