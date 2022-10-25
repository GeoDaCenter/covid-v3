import { useLayoutEffect } from 'react'
import { ControlPopover } from '../../..'
import {
    PanelItemContainer,
    GrabTarget,
    DeleteBlock,
} from './PageComponentsLayout'
import colors from '../../../../config/colors'
import { useSelector } from 'react-redux'
import { HoverButtonsContainer } from '../InterfaceComponents/HoverButtonsContainer'
import { paramsSelectors } from '../../../../stores/paramsStore'
const { selectDates } = paramsSelectors
const TextComponentMapping = {
    '7day': ({ name }) => <h2>7-Day Average Report: {name}</h2>,
    regional: ({ name }) => <h2>Regional Snapshot: {name}</h2>,
    neighbors: ({ name }) => <h2>Neighbor Comparison: {name}</h2>,
    national: () => <h2>National Overview</h2>,
}

/**
 * Wrapper report item for a text item in the report builder. This component
 * shouldn't be called directly, but through the report spec and builder.
 *
 * @category Components/ReportBuilder
 * @param {Object} props
 * @param {string} props.content Text content or one of the following presets as
 *   {preset: String} - "7day", "regional", "neighbors", "national" which
 *   returns a string based on the name property
 * @param {number} props.dateIndex Date index to use for data - days since
 *   1/22/2020
 * @param {string} props.name Name of text component
 * @param {function} props.handleRemove Function to remove this report item from
 *   the report () => void
 * @param {function} props.loadedCallback Function after chart is loaded
 *   (isLoaded: boolean) => void
 */
function TextContainerReport({
    // geoid = null,
    // pageIdx = 0,
    // contentIdx = 0,
    // handleChange,
    handleRemove,
    // width,
    // height,
    content,
    name,
    dateIndex,
    loadedCallback = () => {},
}){
    const dates = useSelector(selectDates)
    const currDate = dateIndex === null ? dates.slice(-1)[0] : dates[dateIndex]

    const InnerComponent =
        typeof content === 'string'
            ? () => <h2>{content}</h2>
            : TextComponentMapping[content?.preset]

    useLayoutEffect(() => {
        loadedCallback(true)
    }, [])
    return (
        <PanelItemContainer>
            <InnerComponent name={name} />
            <h3>Data as of {currDate}</h3>
            <HoverButtonsContainer>
                <ControlPopover
                    className="hover-buttons"
                    inline
                    size={4}
                    iconColor={colors.strongOrange}
                    controlElements={[
                        {
                            type: 'header',
                            content: 'Controls for Table Report Block',
                        },
                        {
                            type: 'helperText',
                            content: 'Select the data to display on the chart.',
                        },
                        // {
                        //   ...widthOptions,
                        //   action: (e) =>
                        //     handleChange({ width: e.target.value }),
                        //   value: width,
                        // },
                        // {
                        //   ...heightOptions,
                        //   action: (e) =>
                        //     handleChange({ height: e.target.value }),
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
    TextContainerReport
}