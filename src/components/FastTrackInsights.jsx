import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Grid from '@mui/material/Grid'
import colors from '../config/colors'
import { arrow } from '../config/svg'
import { summary } from '../meta/summary'
import { LineChart, Line, Tooltip } from 'recharts'

const Container = styled.div`
    width: 100%;
    background-color: #1a1a1a;
    padding: 20px 0 1px 0;
    margin: 60px auto 60px auto;
    h2 {
        text-align: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 0 0 20px 0;
    }
    @media (max-width: 960px) {
        padding-bottom: 0;
    }
`

const WrappedContainer = styled.div`
    max-width: 1140px;
    margin: 60px auto 60px auto;
`

const InsightsContainer = styled(Grid)`
`

const ButtonContainer = styled.div`
    max-width: 1140px;
    display: block;
    margin: 0 auto;
`

const CTAButton = styled.button`
    width: 48%;
    margin: 0;
    background: none;
    border: 1px solid ${colors.white};
    border-radius: 5px;
    position: relative;
    color: white;
    min-height: 60px;
    transition: 250ms all;
    &:nth-of-type(2) {
        margin: 0 2%;
    }
    span.text {
        position: absolute;
        left: 50%;
        top: 20px;
        width: 100%;
        transform: translateX(-50%);
        z-index: 1;
        color: white !important;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 1rem;
    }
    &.active {
        border-color: ${colors.teal};
        background: ${colors.teal};
    }
    @media (max-width: 960px) {
        width: 75%;
        margin: 1em auto 0 auto !important;
        display: block;
        border: none;
        background: ${colors.white}22;
    }
`

const SummaryContainer = styled.div`
    padding: 20px 0;
    max-width: 1140px;
    display: block;
    margin: 20px auto;
    position: relative;
    @media (max-width: 960px) {
        border: none;
        padding-bottom: 2em;
        margin-bottom: 0;
    }
`

const VideoContainer = styled(Grid)`
    P {
        margin-bottom: 1.5rem;
    }
    iframe {
        height: 18rem;
        border-radius: 8px;
    }
`

const SummaryItem = styled.div`
    color: white;
    h3,
    h4 {
        font-weight: bold;
    }
    h3 {
        font-size: 1rem;
    }
    h4 {
        font-size: 3.5rem;
        padding-left: 10px;
    }
    @media (max-width: 960px) {
        text-align: center;
    }
`
const TextContainer = styled.div`
    display: block;

    @media (max-width: 960px) {
        div.recharts-wrapper {
            margin: 0 auto;
        }
    }
`

const GoToMap = styled.a`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    text-decoration: none;
    text-transform: uppercase;
    color: ${colors.darkgray};
    font-family: 'Lato', arial, sans-serif;
    font-weight: bold;
    transition: 250ms all;
    font-size: 1rem;
    background: ${colors.white};
    padding: 0.25em 0.5em;
    svg {
        display: inline-block;
        fill: ${colors.darkgray};
        height: 1rem;
        width: 1rem;
        transform: translateY(2px);
        transition: 250ms all;
    }
    &:hover {
        background: ${colors.yellow};
    }
    @media (max-width: 960px) {
        position: initial;
        margin: 2em auto 0 auto;
        display: block;
        transform: none;
        width: auto;
        text-align: center;
        border: 1px solid ${colors.yellow};
        border-radius: 0.25em;
        padding: 0.5em 0;
    }
`

const CustomTooltip = (props) => {
    try {
        if (props.active) {
            let data = props.payload
            return (
                <div
                    style={{
                        background: colors.darkgray + 'cc',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow:
                            '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
                    }}
                >
                    <p style={{ color: 'white', padding: '5px 0 0 0' }}>
                        {data[0].payload.date}
                    </p>
                    {data.map((data, idx) => (
                        <p
                            style={{
                                color: data.color,
                                padding: '5px 0 0 0',
                                textShadow: `2px 2px 4px ${colors.black}`,
                                fontWeight: 600,
                            }}
                            key={`tooltip-chart-entry-${idx}`}
                        >
                            {data.name === 'dailyNew'
                                ? 'Daily New Cases'
                                : data.name === 'dailyFull'
                                ? 'Daily New Fully Vaccinated'
                                : data.name}
                            :{' '}
                            {Number.isInteger(
                                Math.floor(data.payload[data.dataKey])
                            )
                                ? Math.floor(
                                      data.payload[data.dataKey]
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

/**
 * Home page fast track insights and summary stats
 * @component
 * @category Components/Layout
 */
function FastTrackInsights() {
    const [passiveAnimation, setPassiveAnimation] = useState(true)
    const [activeButton, setActiveButton] = useState(0)
    const [timerID, setTimerID] = useState(null)

    useEffect(() => {
        if (timerID === null && passiveAnimation) {
            clearInterval(timerID)
            setTimerID(
                setInterval(() => {
                    setActiveButton((prev) => (prev + 1) % 2)
                }, 10000)
            )
        }
    }, [timerID, passiveAnimation])

    const handleButton = (buttonIndex) => {
        if (passiveAnimation) {
            clearInterval(timerID)
            setPassiveAnimation(false)
        }
        setActiveButton(buttonIndex)
    }

    return (
        <Container>
            <WrappedContainer>
                <Grid container spacing={8}>
                    <InsightsContainer item xs={12} md={6}>
                        <h2>Fast-track your COVID Insights</h2>
                        <ButtonContainer>
                            <CTAButton
                                className={activeButton === 0 ? 'active' : ''}
                                onMouseEnter={() => handleButton(1)}
                                onClick={() => handleButton(1)}
                            >
                                <span className="text">Case Hotspots</span>
                            </CTAButton>
                            <CTAButton
                                className={activeButton === 1 ? 'active' : ''}
                                onMouseEnter={() => handleButton(0)}
                                onClick={() => handleButton(0)}
                            >
                                <span className="text">Vaccination Progress</span>
                            </CTAButton>
                        </ButtonContainer>
                        <SummaryContainer buttonIndex={activeButton}>
                            {activeButton === 0 && (
                                <SummaryItem>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12} md={6}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    National 7-Day New
                                                    <br />
                                                    Cases on 12/31/22
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <h4>
                                                    {summary.cases.summary.weeklyAverage.toLocaleString(
                                                        'en'
                                                    )}
                                                </h4>
                                            </TextContainer>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    Week Over Week
                                                    <br /> Average Change
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <h4>
                                                    {summary.cases.summary.WoW > 0
                                                        ? '+'
                                                        : ''}
                                                    {summary.cases.summary.WoW}%
                                                </h4>
                                            </TextContainer>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    14-Day National
                                                    <br />
                                                    New Case Trend
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <LineChart
                                                    width={520}
                                                    height={75}
                                                    data={summary.cases['14-day']}
                                                >
                                                    <Line
                                                        type="monotone"
                                                        dataKey="dailyNew"
                                                        stroke={colors.yellow}
                                                        strokeWidth={2}
                                                        dot={false}
                                                        isAnimationActive={false}
                                                    />
                                                    <Tooltip content={CustomTooltip} />
                                                </LineChart>
                                            </TextContainer>
                                        </Grid>
                                    </Grid>
                                </SummaryItem>
                            )}
                            {activeButton === 1 && (
                                <SummaryItem>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12} md={6}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    National Fully Vaccinated
                                                    <br /> As of 12/31/2022 
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <h4>
                                                    {summary.vaccination.summary.fullPct}%
                                                </h4>
                                            </TextContainer>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    National
                                                    <br />
                                                    At Least 1 Shot (All People)
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <h4>
                                                    {
                                                        summary.vaccination.summary
                                                            .oneOrMorePct
                                                    }
                                                    %
                                                </h4>
                                            </TextContainer>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <TextContainer>
                                                <h3 className="metricTitle">
                                                    14-Day National
                                                    <br />
                                                    New Vaccinations Trend
                                                </h3>
                                            </TextContainer>
                                            <TextContainer>
                                                <LineChart
                                                    width={520}
                                                    height={75}
                                                    data={summary.vaccination['14-day']}
                                                >
                                                    <Line
                                                        type="monotone"
                                                        dataKey="dailyFull"
                                                        stroke={colors.skyblue}
                                                        strokeWidth={2}
                                                        dot={false}
                                                        isAnimationActive={false}
                                                    />
                                                    <Tooltip content={CustomTooltip} />
                                                </LineChart>
                                            </TextContainer>
                                        </Grid>
                                    </Grid>
                                </SummaryItem>
                            )}
                        </SummaryContainer>
                    </InsightsContainer>
                    <VideoContainer item xs={12} md={6}>
                        <h2>Pandemic Stories</h2>
                        <p style={{color:'white'}}>Pandemic Stories by the US Covid Atlas collects stories behind the statistics and data. We seek perspectives that represent the diversity of experiences in the United States, in order to build a more holistic archive of the pandemic.</p>
                        <iframe width="100%" height="" src="https://www.youtube.com/embed/pjswdUvwbFE" title="Atlas Stories Overview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </VideoContainer>
                </Grid>
            </WrappedContainer>
        </Container>
    )
}

export default FastTrackInsights
