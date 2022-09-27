import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
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
} from 'recharts'
import { ChartTitle, ChartLabel, Icon } from '../../components'
import colors from '../../config/colors'
import useGetLineChartData from '../../hooks/useGetLineChartData'
import { useSize } from '../../hooks/useSize'
import { paramsActions } from '../../stores/paramsStore'

const {setVariableParams} = paramsActions

const ChartContainer = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    span {
        color: white;
    }
    user-select: none;
`

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
`
const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const numberFormatter = (val) =>
    val > 1000000 ? `${val / 1000000}M` : val > 1000 ? `${val / 1000}K` : val

const dateFormatter = (val) => {
    let tempDate = (new Date(val).getMonth() + 1) % 12
    return tempDate === 0 ? val.slice(0, 4) : monthNames[tempDate]
}

const CustomTick = (props) => {
    return <text {...props}>{props.labelFormatter(props.payload.value)}</text>
}

const getDateRange = ({ startDate, endDate }, monthIncrement = 1) => {
    let dateArray = []
    let currentDate = new Date(startDate)
    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate))
        currentDate.setMonth(currentDate.getMonth() + monthIncrement)
    }
    return dateArray.map((date) => date.toISOString().slice(0, 10))
}

const startAndEndDates = {
    startDate: new Date('02/01/2020'),
    endDate: new Date(),
}

const rangeIncrement = (maximum) => {
    let returnArray = []
    const increment = 2 * 10 ** (`${maximum}`.length - 1)
    for (let i = 0; i < maximum; i += increment) {
        returnArray.push(i)
    }
    return returnArray
}

const getXAxisMonths = (width) => {
    if (width > 800) {
        return [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
        ]
    }
    if (width > 600) {
        return ['01', '04', '07', '10']
    }
    if (width > 450) {
        return ['01', '07']
    }
    return ['01']
}

const CustomTooltip = ({ active, payload, background }) => {
    try {
        if (active) {
            return (
                <div
                    style={{
                        background: background,
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow:
                            '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
                    }}
                >
                    <p
                        style={{
                            color: background === '#000000' ? 'white' : 'black',
                            padding: '5px 0 0 0',
                        }}
                    >
                        {payload[0].payload.date}
                    </p>
                    {payload.map((data, idx) => (
                        <p
                            style={{
                                color: data.color,
                                padding: '5px 0 0 0',
                                fontWeight: 600,
                            }}
                            key={`tooltip-inner-text-${idx}`}
                        >
                            {data.name}:{' '}
                            {!isNaN(+data.payload[data.dataKey])
                                ? (
                                      Math.round(
                                          data.payload[data.dataKey] * 10
                                      ) / 10
                                  ).toLocaleString('en')
                                : data.payload[data.dataKey]}
                        </p>
                    ))}
                </div>
            )
        }
    } catch {
        return null
    }
    return null
}

const LabelText = {
    cases: {
        x1label: 'Cumulative Cases',
        x2label: '7 Day Average',
        title: 'Cases',
    },
    deaths: {
        x1label: 'Cumulative Deaths',
        x2label: '7 Day Average',
        title: 'Deaths',
    },
    vaccines_fully_vaccinated: {
        x1label: 'Total Vaccinations',
        x2label: '7 Day Average',
        title: 'Population Fully Vaccinated',
    },
    testing_wk_pos: {
        x1label: '',
        x2label: '7 Day Average',
        title: 'Testing Positivity',
    },
}

const colorSchemes = {
    light: {
        highlightColor: colors.strongOrange,
        mediumColor: colors.darkgray,
        gridColor: colors.black,
        backgroundColor: colors.white,
        solidColor: colors.black,
    },
    dark: {
        highlightColor: colors.yellow,
        mediumColor: colors.lightgray,
        gridColor: `${colors.white}88`,
        backgroundColor: colors.black,
        solidColor: colors.white,
    },
}

/**
 * Component that returns the inner guts of the chart, for easy memoization
 *
 * @component
 */
function LineChartInner({
    resetDock = () => {},
    docked = false,
    table = 'cases',
    logChart = false,
    showSummarized = false,
    populationNormalized = false,
    shouldShowVariants = false,
    colorScheme = 'dark',
    geoid = [],
    loadedCallback = () => {},
}) {
    // For light and dark color schemes
    const {
        highlightColor,
        mediumColor,
        gridColor,
        backgroundColor,
        solidColor,
    } = colorSchemes[colorScheme]

    const qualtitiveScale = {
        light: colors.qualtitiveScaleLight,
        dark: colors.qualtitiveScaleDark,
    }[colorScheme]

    const dispatch = useDispatch()
    const handleChange = (e) => {
        if (e?.activeTooltipIndex) {
            dispatch(setVariableParams({ nIndex: e.activeTooltipIndex }))
        }
    }
    // width listener
    const ChartRef = useRef(null)
    const { width } = useSize(ChartRef)

    const xAxisMonths = getXAxisMonths(width)
    const dateRange = getDateRange(startAndEndDates)
    const filteredTickMonths = dateRange.filter((f) =>
        xAxisMonths.includes(f.slice(-5, -3))
    )

    // line chart data
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
    })

    // Print layout hack
    // reporting back loaded state add 500ms delay to allow render time
    useEffect(() => {
        setTimeout(() => loadedCallback(!!(maximums && chartData)), 500)
    }, [!!(maximums && chartData)])

    // get first word of snake case, if relevant
    const chartTitle = table.split('_')[0]

    const [activeLine, setActiveLine] = useState(false)
    const handleLegendHover = (o) =>
        setActiveLine(+o.dataKey.split('Weekly')[0])
    const handleLegendLeave = () => setActiveLine(false)
    const { x1label, x2label, title } = LabelText[table]
    const memoizedInnerComponents = useMemo(() => {
        if (maximums && chartData) {
            return (
                <>
                    {selectionKeys.length === 0 && (
                        <Line
                            type="monotone"
                            yAxisId="right"
                            dataKey={`sum${populationNormalized ? '100k' : ''}`}
                            name={x1label}
                            stroke={mediumColor}
                            dot={false}
                            isAnimationActive={false}
                        />
                    )}
                    {selectionKeys.length === 1 &&
                        selectionKeys.map((geoid, idx) => (
                            <Line
                                type="monotone"
                                yAxisId="right"
                                dataKey={`${geoid}Sum${
                                    populationNormalized ? '100k' : ''
                                }`}
                                name={selectionNames[idx] + ' Cumulative'}
                                stroke={
                                    selectionKeys.length === 1
                                        ? mediumColor
                                        : selectionKeys.length >
                                          qualtitiveScale.length
                                        ? mediumColor
                                        : qualtitiveScale[idx]
                                }
                                // strokeDasharray={"2,2"}
                                dot={false}
                                isAnimationActive={false}
                                key={`line-${idx}`}
                            />
                        ))}
                    {selectionKeys.length === 0 && (
                        <Line
                            type="monotone"
                            yAxisId="left"
                            dataKey={`weekly${
                                populationNormalized ? '100k' : ''
                            }`}
                            name={x2label}
                            stroke={highlightColor}
                            dot={false}
                            isAnimationActive={false}
                        />
                    )}
                    {selectionKeys.length > 0 &&
                        selectionKeys.map((geoid, idx) => (
                            <Line
                                type="monotone"
                                yAxisId="left"
                                key={`line-weekly-${geoid}`}
                                dataKey={`${geoid}Weekly${
                                    populationNormalized ? '100k' : ''
                                }`}
                                name={selectionNames[idx] + ' 7-Day Ave'}
                                stroke={
                                    selectionKeys.length === 1
                                        ? highlightColor
                                        : selectionKeys.length >
                                          qualtitiveScale.length
                                        ? highlightColor
                                        : qualtitiveScale[idx]
                                }
                                dot={false}
                                isAnimationActive={false}
                                strokeOpacity={activeLine === geoid ? 1 : 0.7}
                                strokeWidth={activeLine === geoid ? 3 : 1}
                            />
                        ))}
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
                                    value: 'Alpha, Beta',
                                    angle: 90,
                                    position: 'left',
                                    fill: 'gray',
                                }}
                            />
                            <ReferenceLine
                                x="2021-01-11"
                                yAxisId="left"
                                stroke="gray"
                                strokeWidth={0.5}
                                label={{
                                    value: 'Gamma',
                                    angle: 90,
                                    position: 'left',
                                    fill: 'gray',
                                }}
                            />
                            <ReferenceLine
                                x="2021-05-11"
                                yAxisId="left"
                                stroke="gray"
                                strokeWidth={0.5}
                                label={{
                                    value: 'Delta',
                                    angle: 90,
                                    position: 'left',
                                    fill: 'gray',
                                }}
                            />
                            <ReferenceLine
                                x="2021-11-26"
                                yAxisId="left"
                                stroke="gray"
                                strokeWidth={0.5}
                                label={{
                                    value: 'Omicron',
                                    angle: 90,
                                    position: 'left',
                                    fill: 'gray',
                                }}
                            />
                        </>
                    )}
                </>
            )
        } else {
            return null
        }
    }, [
        JSON.stringify({
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
            geoid,
        }),
    ])

    // REFERENCE AREA COORDS
    const x1 = chartData[currIndex - currRange]?.date || '2020-01-21'
    const areaX1 = x1 < '2020-01-20' ? '2020-01-20' : x1

    const x2 =
        chartData[currIndex]?.date || chartData[chartData.length - 1]?.date
    const areaX2 = x2

    if (maximums && chartData) {
        return (
            <ChartContainer ref={ChartRef} id="lineChart">
                {!docked && (
                    <DockPopButton
                        onClick={resetDock}
                        title="Dock Line Chart Panel"
                    >
                        <Icon symbol="popOut" />
                    </DockPopButton>
                )}
                {selectionNames.length < 2 ? (
                    <ChartTitle color={gridColor}>
                        <span>
                            {title}
                            {selectionNames.length
                                ? `: ${selectionNames[0]}`
                                : ''}
                        </span>
                    </ChartTitle>
                ) : (
                    <ChartTitle color={gridColor}>
                        <span>{chartTitle} over time</span>
                    </ChartTitle>
                )}
                <ChartLabel
                    color={highlightColor}
                    left={colorScheme === 'light' ? -20 : -30}
                >
                    {x2label}
                </ChartLabel>
                <ChartLabel color={mediumColor} right={-35}>
                    {x1label}
                </ChartLabel>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 0,
                            right: colorScheme === 'light' ? 30 : 20,
                            left: 5,
                            bottom: 60,
                        }}
                        onClick={isTimeseries ? handleChange : null}
                    >
                        <XAxis
                            dataKey="date"
                            ticks={filteredTickMonths}
                            minTickGap={-50}
                            domain={[
                                startAndEndDates.startDate
                                    .toISOString()
                                    .slice(0, 10),
                                startAndEndDates.endDate
                                    .toISOString()
                                    .slice(0, 10),
                            ]}
                            tick={(props) => (
                                <CustomTick
                                    {...props}
                                    style={{
                                        fill:
                                            props.payload.value.slice(
                                                -5,
                                                -3
                                            ) === '01'
                                                ? solidColor
                                                : gridColor,
                                        fontSize: '10px',
                                        fontFamily: 'Lato',
                                        fontWeight: 600,
                                        transform: 'translateY(10px)',
                                    }}
                                    labelFormatter={dateFormatter}
                                />
                            )}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            type="number"
                            scale={logChart ? 'log' : 'linear'}
                            domain={[0.01, 'dataMax']}
                            allowDataOverflow
                            ticks={rangeIncrement({ maximum: maximums.count })}
                            tick={
                                <CustomTick
                                    style={{
                                        fill: mediumColor,
                                        fontSize: '10px',
                                        fontFamily: 'Lato',
                                        fontWeight: 600,
                                        transform: 'translateY(px)',
                                    }}
                                    labelFormatter={numberFormatter}
                                />
                            }
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            scale={logChart ? 'log' : 'linear'}
                            domain={[0.01, 'dataMax']}
                            allowDataOverflow
                            ticks={rangeIncrement({ maximum: maximums.sum })}
                            tick={
                                <CustomTick
                                    style={{
                                        fill: highlightColor,
                                        fontSize: '10px',
                                        fontFamily: 'Lato',
                                        fontWeight: 600,
                                        transform: 'translateY(2px)',
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
        )
    } else {
        return null
    }
}

export default LineChartInner
