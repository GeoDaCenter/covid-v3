import { useLayoutEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useGetScatterData from '../../../../hooks/useGetScatterData'
import { ControlPopover, ScatterChartInner } from '../../..'
import {
    PanelItemContainer,
    GrabTarget,
    DeleteBlock,
    CenteredChartTitle,
} from './PageComponentsLayout'
import colors from '../../../../config/colors'
import { HoverButtonsContainer } from '../InterfaceComponents/HoverButtonsContainer'
import { paramsSelectors } from '../../../../stores/paramsStore'
const { selectVariables } = paramsSelectors
const RadiusRange = Array(10)
    .fill(0)
    .map((_, idx) => ({ value: idx + 1, label: `${idx + 1}` }))

/**
 * Wrapper report item for a scatterp lot in the report builder. This component
 * shouldn't be called directly, but through the report spec and builder.
 *
 * @category Components/ReportBuilder
 * @param {Object} props
 * @param {function} props.handleChange Function to partially change a report
 *   item (props: Partial<ReportItem>) => void See Report Slice for more
 * @param {function} props.handleRemove Function to remove this report item from
 *   the report () => void
 * @param {function} props.loadedCallback Function after chart is loaded
 *   (isLoaded: boolean) => void
 * @param {string} props.xAxisVar - Variable to use for the x axis
 * @param {string} props.yAxisVar - Variable to use for the y axis
 * @param {number} props.radius - Radius of the points
 *  
 */
function ScatterChartReport({
    // geoid = null,
    // pageIdx = 0,
    // contentIdx = 0,
    handleChange,
    // handleToggle,
    handleRemove,
    // width,
    // height,
    xAxisVar,
    yAxisVar,
    radius = 4,
    loadedCallback = () => {},
}){
    const variables = useSelector(selectVariables)
    const ScatterPlotVars = useMemo(
        () =>
            variables.map(({ variableName }) => ({
                label: variableName,
                value: variableName,
            })),
        [variables.length]
    )

    const { scatterData, timestamp } = useGetScatterData({
        xAxisVar,
        yAxisVar,
    })

    useLayoutEffect(() => {
        loadedCallback(timestamp !== null)
    }, [timestamp])

    const scatterChart = useMemo(
        () =>
            timestamp !== null ? (
                <ScatterChartInner
                    {...{ scatterData, xAxisVar, yAxisVar, radius }}
                    theme="light"
                />
            ) : null,
        [timestamp]
    )
    return (
        <PanelItemContainer>
            <CenteredChartTitle>
                <h3>
                    {xAxisVar} (x) vs {yAxisVar} (y)
                </h3>
            </CenteredChartTitle>
            {scatterChart}
            <HoverButtonsContainer>
                <ControlPopover
                    className="hover-buttons"
                    inline
                    size={4}
                    iconColor={colors.strongOrange}
                    controlElements={[
                        {
                            type: 'header',
                            content: 'Controls for Scatter Chart Block',
                        },
                        {
                            type: 'helperText',
                            content: 'Select the data to display on the chart.',
                        },
                        {
                            type: 'select',
                            content: {
                                label: 'Change X Variable',
                                items: ScatterPlotVars,
                            },
                            action: (e) =>
                                handleChange({ xAxisVar: e.target.value }),
                            value: xAxisVar,
                        },
                        {
                            type: 'select',
                            content: {
                                label: 'Change Y Variable',
                                items: ScatterPlotVars,
                            },
                            action: (e) =>
                                handleChange({ yAxisVar: e.target.value }),
                            value: yAxisVar,
                        },
                        {
                            type: 'select',
                            content: {
                                label: 'Change Dot Radius',
                                items: RadiusRange,
                            },
                            action: (e) =>
                                handleChange({ radius: e.target.value }),
                            value: radius,
                        },
                        // {
                        //   ...widthOptions,
                        //   action: (e) =>
                        //     handleChange(pageIdx, contentIdx, { width: e.target.value }),
                        //   value: width,
                        // },
                        // {
                        //   ...heightOptions,
                        //   action: (e) =>
                        //     handleChange(pageIdx, contentIdx, { height: e.target.value }),
                        //   value: height,
                        // },
                    ]}
                />
                <GrabTarget
                    iconColor={colors.strongOrange}
                    className="hover-buttons"
                />
                <DeleteBlock
                    iconColor={colors.strongOrange}
                    className="hover-buttons"
                    onClick={() => handleRemove()}
                />
            </HoverButtonsContainer>
        </PanelItemContainer>
    )
}

export {
    ScatterChartReport
}