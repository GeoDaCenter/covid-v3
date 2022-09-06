import React, { useState, useRef, useEffect } from "react";
import ReportComponentMapping from "../PageComponents/PageComponents";
import { useDispatch } from "react-redux";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  LayoutPageContainer,
  DateWaterMark,
  AtlasWaterMark,
  Attribution,
} from "./ReportPageLayout";
import { useSelector } from "react-redux";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ReportPage({
  pageIdx,
  pageWidth,
  zoomMultiplier,
  reportName,
  onMount,
}) {
  const dispatch = useDispatch();
  const [isSettled, setIsSettled] = useState(false);

  const layout = useSelector(
    ({ report }) => report.reports?.[reportName]?.layout?.[pageIdx]
  );
  const pageRef = useRef(null);

  useEffect(() => {
    onMount(pageRef, pageIdx);
    setIsSettled(true);
  }, [pageIdx]);

  if (!layout){
    return null
  }

  const handleLayoutChange = (layout) => {
    dispatch({
      type: "UPDATE_REPORT_LAYOUT",
      payload: {
        reportName,
        pageIdx,
        layout,
      },
    })
  };

  return (
    <div style={{ position: "relative" }}>
      <LayoutPageContainer
        ref={pageRef}
        pageWidth={pageWidth}
        zoomMultiplier={zoomMultiplier}
      >
        {isSettled && (
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
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
            rowHeight={160}
            draggableHandle={".content-header"}
            autoSize={true}
            onLayoutChange={handleLayoutChange}
            isDraggable
            compactType="vertical"
            isRearrangeable
            isResizable
            resizeHandles={["se"]}
          >
            {layout.map(({ i }) => (
              <div key={i}>
                <ReportComponentMapping
                  key={i}
                  itemId={i}
                  {...{ pageIdx, reportName }}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}

        <DateWaterMark />
        <AtlasWaterMark />
        <Attribution />
      </LayoutPageContainer>
    </div>
  );
}
