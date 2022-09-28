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

export default function ReportComponentMapping({
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
