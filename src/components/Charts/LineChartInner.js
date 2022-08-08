import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setVariableParams } from "../../actions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  // Label,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { ChartTitle, ChartLabel, Icon } from "../../components";
import colors from "../../config/colors";
import useGetLineChartData from "../../hooks/useGetLineChartData";

const ChartContainer = styled.span`
  span {
    color: white;
  }
  user-select: none;
`;

const DockPopButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 2em;
  height: 2em;
  background: none;
  border: none;
  padding: 0.25em;
  z-index: 1;
  cursor: pointer;
  svg g {
    fill: ${colors.yellow};
  }
`;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const numberFormatter = (val) =>
  val > 1000000 ? `${val / 1000000}M` : val > 1000 ? `${val / 1000}K` : val;
const dateFormatter = (val) => {
  let tempDate = (new Date(val).getMonth() + 1) % 12;
  return tempDate === 0 ? val.slice(0, 4) : monthNames[tempDate];
};

const CustomTick = (props) => (
  <text {...props}>{props.labelFormatter(props.payload.value)}</text>
);

const getDateRange = ({ startDate, endDate }) => {
  let dateArray = [];

  let years = [];

  if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
    years = [endDate.getUTCFullYear()];
  } else {
    for (
      let i = startDate.getUTCFullYear();
      i <= endDate.getUTCFullYear();
      i++
    ) {
      years.push(i);
    }
  }

  for (let i = 0; i < years.length; i++) {
    let yearStr = "" + years[i];
    let n;

    if (years[i] === 2020) {
      n = 2;
    } else {
      n = 1;
    }

    let dateString = `${yearStr}-${n < 10 ? 0 : ""}${n}-01`;
    while (n < 13) {
      dateString = `${yearStr}-${n < 10 ? 0 : ""}${n}-01`;
      dateArray.push(dateString);
      n++;
    }
  }
  return dateArray;
};

const rangeIncrement = (maximum) => {
  let returnArray = [];
  const increment = 2 * 10 ** (`${maximum}`.length - 1);
  for (let i = 0; i < maximum; i += increment) {
    returnArray.push(i);
  }
  return returnArray;
};

const dateRange = getDateRange({
  startDate: new Date("02/01/2020"),
  endDate: new Date(),
});

const CustomTooltip = ({ active, payload, background }) => {
  try {
    if (active) {
      return (
        <div
          style={{
            background: background,
            padding: "10px",
            borderRadius: "4px",
            boxShadow:
              "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
          }}
        >
          <p style={{ color: background === "#000000" ? "white" : "black", padding: "5px 0 0 0" }}>
            {payload[0].payload.date}
          </p>
          {payload.map((data, idx) => (
            <p
              style={{
                color: data.color,
                padding: "5px 0 0 0",
                fontWeight: 600,
              }}
              key={`tooltip-inner-text-${idx}`}
            >
              {data.name}:{" "}
              {!isNaN(+data.payload[data.dataKey])
                ? (Math.round(data.payload[data.dataKey]*10)/10).toLocaleString("en")
                : data.payload[data.dataKey]}
            </p>
          ))}
        </div>
      );
    }
  } catch {
    return null;
  }
  return null;
};

const LabelText = {
  cases: {
    x1label: "Cumulative Cases",
    x2label: "7 Day Average",
    title: "Cases",
  },
  deaths: {
    x1label: "Cumulative Deaths",
    x2label: "7 Day Average",
    title: "Deaths",
  },
  vaccines_fully_vaccinated: {
    x1label: "Total Vaccinations",
    x2label: "7 Day Average",
    title: "Population Fully Vaccinated",
  },
  testing_wk_pos: {
    x1label: "",
    x2label: "7 Day Average",
    title: "Testing Positivity",
  },
};

const colorSchemes = {
  light: {
    highlightColor: colors.strongOrange,
    mediumColor: colors.darkgray,
    gridColor: colors.black,
    backgroundColor: colors.white,
  },
  dark: {
    highlightColor: colors.yellow,
    mediumColor: colors.lightgray,
    gridColor: `${colors.white}88`,
    backgroundColor: colors.black,
  },
};

function LineChartInner({
  resetDock = () => { },
  docked = false,
  table = "cases",
  logChart = false,
  showSummarized = false,
  populationNormalized = false,
  shouldShowVariants = false,
  colorScheme = "dark",
  geoid = [],
}) {
  const { highlightColor, mediumColor, gridColor, backgroundColor } =
    colorSchemes[colorScheme];
  const qualtitiveScale = {
    light: colors.qualtitiveScaleLight,
    dark: colors.qualtitiveScaleDark,
  }[colorScheme];

  const dispatch = useDispatch();
  const {
    // currentData,
    currIndex,
    currRange,
    chartData,
    maximums,
    isTimeseries,
    selectionKeys,
    selectionNames,
  } = useGetLineChartData({
    table,
    geoid,
  });

  // get first word of snake case, if relevant
  const chartTitle = table.split('_')[0]

  const [activeLine, setActiveLine] = useState(false);
  const handleChange = (e) =>
    e?.activeTooltipIndex &&
    dispatch(setVariableParams({ nIndex: e.activeTooltipIndex }));
  const handleLegendHover = (o) => setActiveLine(+o.dataKey.split("Weekly")[0]);
  const handleLegendLeave = () => setActiveLine(false);
  const { x1label, x2label, title } = LabelText[table];
  const memoizedInnerComponents = useMemo(() => {
    if (maximums && chartData) {
      return <>
        {selectionKeys.length === 0 && (
          <Line
            type="monotone"
            yAxisId="right"
            dataKey={`sum${populationNormalized ? "100k" : ""}`}
            name={x1label}
            stroke={mediumColor}
            dot={false}
            isAnimationActive={false}
          />
        )}
        {selectionKeys.length === 1 && (
          selectionKeys.map((geoid, idx) => (
            <Line
              type="monotone"
              yAxisId="right"
              dataKey={`${geoid}Sum${populationNormalized ? "100k" : ""}`}
              name={selectionNames[idx] + " Cumulative"}
              stroke={
                selectionKeys.length === 1
                  ? mediumColor
                  : selectionKeys.length > qualtitiveScale.length
                    ? mediumColor
                    : qualtitiveScale[idx]
              }
              // strokeDasharray={"2,2"}
              dot={false}
              isAnimationActive={false}
              key={`line-${idx}`}
            />
          ))
        )}
        {selectionKeys.length === 0 && (
          <Line
            type="monotone"
            yAxisId="left"
            dataKey={`weekly${populationNormalized ? "100k" : ""}`}
            name={x2label}
            stroke={highlightColor}
            dot={false}
            isAnimationActive={false}
          />
        )}
        {selectionKeys.length > 0 && (
          selectionKeys.map((geoid, idx) => (
            <Line
              type="monotone"
              yAxisId="left"
              key={`line-weekly-${geoid}`}
              dataKey={`${geoid}Weekly${populationNormalized ? "100k" : ""
                }`}
              name={selectionNames[idx] + " 7-Day Ave"}
              stroke={
                selectionKeys.length === 1
                  ? highlightColor
                  : selectionKeys.length > qualtitiveScale.length
                    ? highlightColor
                    : qualtitiveScale[idx]
              }
              dot={false}
              isAnimationActive={false}
              strokeOpacity={activeLine === geoid ? 1 : 0.7}
              strokeWidth={activeLine === geoid ? 3 : 1}
            />
          ))
        )}
        {selectionKeys.length > 1 && showSummarized && (
          <Line
            type="monotone"
            yAxisId="right"
            dataKey="keySum"
            name="Total For Selection"
            stroke={mediumColor}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        )}
        {selectionKeys.length < qualtitiveScale.length && (
          <Legend
            onMouseEnter={handleLegendHover}
            onMouseLeave={handleLegendLeave}
            margin={{ top: 40, left: 0, right: 0, bottom: 50 }}
            iconType="plainline"
          />
        )}
        {shouldShowVariants && (
          <>
            <ReferenceLine
              x="2020-12-18"
              yAxisId="left"
              stroke="gray"
              strokeWidth={0.5}
              label={{
                value: "Alpha, Beta",
                angle: 90,
                position: "left",
                fill: "gray",
              }}
            />
            <ReferenceLine
              x="2021-01-11"
              yAxisId="left"
              stroke="gray"
              strokeWidth={0.5}
              label={{
                value: "Gamma",
                angle: 90,
                position: "left",
                fill: "gray",
              }}
            />
            <ReferenceLine
              x="2021-05-11"
              yAxisId="left"
              stroke="gray"
              strokeWidth={0.5}
              label={{
                value: "Delta",
                angle: 90,
                position: "left",
                fill: "gray",
              }}
            />
            <ReferenceLine
              x="2021-11-26"
              yAxisId="left"
              stroke="gray"
              strokeWidth={0.5}
              label={{
                value: "Omicron",
                angle: 90,
                position: "left",
                fill: "gray",
              }}
            />
          </>
        )}
      </>
    } else {
      return null
    }
  }, [JSON.stringify({
    maximums,
    selectionKeys,
    chartData,
  docked,
    table,
    logChart,
    showSummarized,
    populationNormalized,
    shouldShowVariants,
    colorScheme,
    geoid
  })])

  // REFERENCE AREA COORDS
  const x1 = (chartData[currIndex - currRange]?.date || '2020-01-21')
  const areaX1 = x1 < '2020-01-20'
    ? '2020-01-20'
    : x1
    
  const x2 = (chartData[currIndex]?.date || chartData[chartData.length-1]?.date)
  const areaX2 = x2

  if (maximums && chartData) {
    return (
      <ChartContainer id="lineChart">
        {!docked && (
          <DockPopButton onClick={resetDock} title="Dock Line Chart Panel">
            <Icon symbol="popOut" />
          </DockPopButton>
        )}
        {selectionNames.length < 2 ? (
          <ChartTitle color={gridColor}>
            <span>
              {title}
              {selectionNames.length ? `: ${selectionNames[0]}` : ""}
            </span>
          </ChartTitle>
        ) : (
          <ChartTitle color={gridColor}>
            <span>{chartTitle} over time</span>
          </ChartTitle>
        )}
        <ChartLabel
          color={highlightColor}
          left={colorScheme === "light" ? -20 : -30}
        >
          {x2label}
        </ChartLabel>
        <ChartLabel
          color={mediumColor}
          right={-35}
        >
          {x1label}
        </ChartLabel>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 0,
              right: colorScheme === "light" ? 30 : 20,
              left: 5,
              bottom: 60,
            }}
            onClick={isTimeseries ? handleChange : null}
          >
            <XAxis
          dataKey="date"
          ticks={dateRange}
          minTickGap={-50}
          tick={
            <CustomTick
              style={{
                fill: gridColor,
                fontSize: "10px",
                fontFamily: "Lato",
                fontWeight: 600,
                transform: "translateY(10px)",
              }}
              labelFormatter={dateFormatter}
            />
          }
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          type="number"
          scale={logChart ? "log" : "linear"}
          domain={[0.01, "dataMax"]}
          allowDataOverflow
          ticks={rangeIncrement({ maximum: maximums.count })}
          tick={
            <CustomTick
              style={{
                fill: mediumColor,
                fontSize: "10px",
                fontFamily: "Lato",
                fontWeight: 600,
              }}
              labelFormatter={numberFormatter}
            />
          }
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          scale={logChart ? "log" : "linear"}
          domain={[0.01, "dataMax"]}
          allowDataOverflow
          ticks={rangeIncrement({ maximum: maximums.sum })}
          tick={
            <CustomTick
              style={{
                fill: highlightColor,
                fontSize: "10px",
                fontFamily: "Lato",
                fontWeight: 600,
              }}
              labelFormatter={numberFormatter}
            />
          }
        />
            {memoizedInnerComponents}
            <Tooltip
              content={({ active, payload }) => (
                <CustomTooltip
                  background={backgroundColor}
                  {...{
                    active,
                    payload,
                  }}
                />
              )}
            />
            <ReferenceArea
              yAxisId="right"
              x1={areaX1}
              x2={areaX2}
              fill="white"
              fillOpacity={0.15}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  } else {
    return null;
  }
}

export default LineChartInner
