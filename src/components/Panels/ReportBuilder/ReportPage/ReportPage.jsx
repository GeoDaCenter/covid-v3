import React, { useRef, useEffect } from 'react'
import ReportComponentMapping from '../PageComponents/PageComponents'
import { useDispatch } from 'react-redux'
import { Responsive, WidthProvider } from 'react-grid-layout'
import {
    LayoutPageContainer,
    DateWaterMark,
    AtlasWaterMark,
    Attribution,
} from './ReportPageLayout'
import { useSelector } from 'react-redux'
import { NoInteractionGate } from '../PageComponents/MapReport'
import { Box } from '@mui/material'
import styled from 'styled-components'
import LinearProgress from '@mui/material/LinearProgress'
import { reportSelectors, reportActions } from '../../../../stores/reportStore'
const { selectPrintStatus, selectIsLoaded } = reportSelectors
const { updateReportLayout } = reportActions
const ResponsiveGridLayout = WidthProvider(Responsive)

const OuterContainer = styled.div`
    position: relative;
    pointer-events: ${({ loading }) => (loading ? 'none' : 'auto')};
`

const Loader = () => (
    <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
        }}
    >
        <Box sx={{ maxWidth: '100px' }}>
            <LinearProgress />
            <p>Loading...</p>
        </Box>
    </div>
)

/**
 * Renderer for single page of report. See usage {@linkcode src/components/Panels/ReportBuilder/Report/Report.jsx}
 *
 * @category Components/ReportBuilder
 * @param {Object} props
 * @param {number} props.pageIdx - Index of page in report
 * @param {number} props.pageWidth - Width of page in pixels
 * @param {number} props.zoomMultiplier Multiplier for zoom level of the report
 * @param {string} props.reportName Name of the report
 * @param {function} props.onMount - Callback for when page is mounted (pageRef:
 *   React.RefObject<HTMLDivElement>) => void
 * @param {function} props.handleItemLoad - Callback for when item is loaded
 *   (itemId: string,isLoaded: boolean) => void
 * @component
 */
function ReportPage({
    pageIdx,
    pageWidth,
    zoomMultiplier,
    reportName,
    onMount,
    handleItemLoad,
}) {
    const dispatch = useDispatch()
    const layout = useSelector(
        ({ report }) => report.reports?.[reportName]?.layout?.[pageIdx]
    )
    const isPrinting = useSelector(selectPrintStatus)
    const pageIsLoaded = useSelector(selectIsLoaded)
    const pageRef = useRef(null)

    useEffect(() => {
        !!pageRef?.current && onMount(pageRef.current)
    }, [!!pageRef?.current, pageIdx])

    if (!layout) {
        return null
    }

    const handleLayoutChange = (layout) => {
        dispatch(
            updateReportLayout({
                reportName,
                pageIdx,
                layout,
            })
        )
    }

    return (
        <OuterContainer loading={!pageIsLoaded}>
            <LayoutPageContainer
                ref={pageRef}
                pageWidth={pageWidth}
                zoomMultiplier={zoomMultiplier}
                isPrinting={isPrinting}
            >
                {!pageIsLoaded && <Loader />}
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{
                        lg: layout,
                        md: layout,
                        sm: layout,
                        xs: layout,
                        xxs: layout,
                    }}
                    layout={layout}
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    cols={{ lg: 8, md: 8, sm: 8, xs: 8, xxs: 8 }}
                    rowHeight={16}
                    draggableHandle={'.content-header'}
                    autoSize={true}
                    onLayoutChange={handleLayoutChange}
                    isDraggable
                    compactType="vertical"
                    isRearrangeable
                    isResizable
                    resizeHandles={['se']}
                >
                    {layout.map(({ i }) => (
                        <div key={i}>
                            <ReportComponentMapping
                                key={i}
                                itemId={i}
                                handleItemLoad={handleItemLoad}
                                {...{ pageIdx, reportName }}
                            />
                        </div>
                    ))}
                </ResponsiveGridLayout>
                <NoInteractionGate style={{ height: 'auto' }}>
                    <DateWaterMark />
                    <AtlasWaterMark />
                    <Attribution />
                </NoInteractionGate>
            </LayoutPageContainer>
        </OuterContainer>
    )
}

export default ReportPage
