import { useLayoutEffect } from 'react'
import { ControlPopover, TextStatistics } from '../../..'
import {
    PanelItemContainer,
    GrabTarget,
    DeleteBlock,
} from './PageComponentsLayout'
import colors from '../../../../config/colors'
import countyNames from '../../../../meta/countyNames'
import { HoverButtonsContainer } from '../InterfaceComponents/HoverButtonsContainer'

/**
 * Wrapper report item for a text item in the report builder. This component
 * shouldn't be called directly, but through the report spec and builder.
 *
 * @param {Object} props
 * @param {number} props.geoid GEOID to include in the report
 * @param {string} props.format Text format to use - 'bullet' | 'paragraph'
 * @param {number} props.dateIndex Date index to use for data - days since
 *   1/22/2020
 * @param {function} props.handleChange Function to partially change a report
 *   item (props: Partial<ReportItem>) => void See Report Slice for more
 * @param {function} props.handleRemove Function to remove this report item from
 *   the report () => void
 * @param {function} props.handleRemove Function to remove this report item from
 *   the report () => void
 * @param {function} props.loadedCallback Function after chart is loaded
 *   (isLoaded: boolean) => void
 * @component
 * @category Components/ReportBuilder
 */
function TextReport({
    geoid = null,
    // pageIdx = 0,
    // contentIdx = 0,
    handleChange,
    handleRemove,
    format = 'bullet',
    dateIndex,
    loadedCallback,
}){
    useLayoutEffect(() => {
        loadedCallback(true)
    }, [])
    return (
        <PanelItemContainer>
            <TextStatistics {...{ geoid, format, dateIndex }} />
            <HoverButtonsContainer>
                <ControlPopover
                    className="hover-buttons"
                    inline
                    size={4}
                    iconColor={colors.strongOrange}
                    controlElements={[
                        {
                            type: 'header',
                            content: 'Controls for Text Report Block',
                        },
                        {
                            type: 'helperText',
                            content: 'Select the data to display on the chart.',
                        },
                        {
                            type: 'select',
                            content: {
                                label: 'Change County',
                                items: countyNames,
                            },
                            action: (e) =>
                                handleChange({ geoid: e.target.value }),
                            value: geoid,
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
};

export {
    TextReport
}