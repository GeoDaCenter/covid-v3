import { TextReport } from './TextReport'
import { TextContainerReport } from './TextContainerReport'
import { LineChartReport } from './LineChartReport'
import { TableReport } from './TableReport'
import { ScatterChartReport } from './ScatterChartReport'
import MapReport from './MapReport'
import { useDispatch, useSelector } from 'react-redux'
import { reportSelectors, reportActions } from '../../../../stores/reportStore'
const { selectReportMeta, selectItem } = reportSelectors
const { changeReportItem, deleteReportItem, toggleReportItem } = reportActions

const mapping = {
    textReport: TextReport,
    text: TextContainerReport,
    lineChart: LineChartReport,
    table: TableReport,
    scatterChart: ScatterChartReport,
    map: MapReport,
}

/**
 * Engine component for rendering report items. Generated handleRemove,
 * handleToggle, handleChange, and handleAddItem callbacks. Do not call this
 * component directly, it should be generated through the report.
 *
 * @category Components/ReportBuilder
 * @param {Object} props
 * @param {function} props.handleItemLoad Higher level callback for loading
 *   report items. Passed into child components as loadedCallback. (itemId:
 *   string, isLoaded: boolean) => void
 * @param {number} props.pageIdx Index of the page this item is on
 * @param {string} props.itemId ID of the report item
 * @param {string} props.reportName Name of the report
 */
function ReportComponentMapping({
    handleItemLoad = () => {},
    itemId,
    pageIdx,
    reportName,
}) {
    const dispatch = useDispatch()
    const meta = useSelector(selectReportMeta(reportName))
    const itemProps = useSelector(selectItem(reportName, itemId))

    const handleChange = (props) =>
        dispatch(
            changeReportItem({
                reportName,
                itemId,
                props,
            })
        )

    const handleRemove = () =>
        dispatch(
            deleteReportItem({
                reportName,
                pageIdx,
                itemId,
            })
        )

    const handleToggle = (prop) =>
        dispatch(
            toggleReportItem({
                reportName,
                itemId,
                prop,
            })
        )

    const loadedCallback = (isLoaded) => {
        handleItemLoad(itemId, isLoaded)
    }

    if (!itemProps) return null

    const { type } = itemProps
    const InnerEl = mapping[type]

    if (!InnerEl) return null
    return (
        <InnerEl
            {...{
                ...meta,
                ...itemProps,
                itemId,
                reportName,
                handleRemove,
                handleToggle,
                handleChange,
                loadedCallback,
            }}
        />
    )
}

export default ReportComponentMapping