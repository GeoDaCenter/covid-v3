import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Report from "../Report/Report";
import { MetaButton, StyledPagination } from "../Report/MetaButtons";
import Stack from "@mui/material/Stack";
import { AddItemsSpeeedDial } from "../InterfaceComponents/AddItemsSpeedDial";
import { ZoomInMap, ZoomOutMap, CropFree } from "@mui/icons-material";
import { ButtonContainer } from "../Report/LayoutContainer";
import { reportSelectors, reportActions } from '../../../../stores/reportStore'
const { selectCurrentPage, selectCurrentReport } = reportSelectors;
const { addReportPage, addReportItem, setReportPage } = reportActions;
export const ReportEditor = ({ activeStep, handleStep }) => {
  const dispatch = useDispatch();

  const currPage = useSelector(selectCurrentPage);
  const reportName = useSelector(selectCurrentReport);

  const layouts = useSelector(
    ({ report }) => report.reports?.[reportName]?.layout
  );
  const pageLength = layouts?.length;
  const layout = layouts?.[currPage];

  const [zoomMultiplier, setZoomMultiplier] = useState(1);
  const handleZoom = (action) => {
    switch (action) {
      case "zoomIn":
        setZoomMultiplier((prev) => prev + 0.1);
        break;
      case "zoomOut":
        setZoomMultiplier((prev) => prev - 0.1);
        break;
      case "reset":
        setZoomMultiplier(1);
        break;
      default:
        break;
    }
  };
  const handleAddItem = (item) => {
    if (item.type === "page") {
      handleAddPage();
    } else {
      dispatch(
        addReportItem({
          reportName,
          pageIdx: currPage,
          item,
        }))
    }
  };
  const handleAddPage = () => dispatch(addReportPage(reportName));
  const handleChangePage = (_e, value) => {
    dispatch(setReportPage(value - 1))
  };

  const canAddItem = !layout?.find(
    (item) => item.y + item.h >= 70 && item.x + item.w >= 80
  );

  return (
    <>
      <Stack sx={{ maxHeight: "100%" }}>
        <Report
          reportName={reportName}
          activeStep={activeStep}
          zoomMultiplier={zoomMultiplier}
          handleStep={handleStep}
        />

        <ButtonContainer>
          <Stack
            spacing={2}
            width="100%"
            alignItems="flex-end"
            justifyContent="space-between"
            direction="row"
            sx={{
              mt: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <p>Page Zoom</p>
              <MetaButton
                variant="text"
                aria-label="Zoom in report page"
                title="Zoom in report page"
                onClick={() => handleZoom("zoomIn")}
              >
                <ZoomInMap />
              </MetaButton>
              <MetaButton
                variant="text"
                aria-label="Zoom out report page"
                title="Zoom out report page"
                onClick={() => handleZoom("zoomOut")}
              >
                <ZoomOutMap />
              </MetaButton>
              <MetaButton
                variant="text"
                aria-label="Reset zoom"
                title="Reset zoom"
                onClick={() => handleZoom("reset")}
              >
                <CropFree />
              </MetaButton>
            </Stack>
            <Stack alignItems="center" sx={{
              mt: 2,
              justifySelf: "center",
              marginRight: "-15%"
            }}>
              <StyledPagination
                variant="outlined"
                shape="rounded"
                count={pageLength}
                page={currPage + 1}
                onChange={handleChangePage}
              />
            </Stack>
            <Stack justifyContent="flex-end" sx={{ maxHeight: 20 }}>
              <AddItemsSpeeedDial
                canAddItem={canAddItem}
                handleAddItem={handleAddItem}
              />
            </Stack>
          </Stack>
        </ButtonContainer>
      </Stack>
    </>
  );
};
