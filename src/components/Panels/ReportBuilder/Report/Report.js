import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportPage from "../ReportPage/ReportPage";
import {
  LayoutContainer,
  PrintModalStyle,
} from "./LayoutContainer";
import { Alert, Box, Button, Stack, Modal, Snackbar, Typography, LinearProgress } from "@mui/material";
import { usePrintReport } from "../../../../hooks/usePrintReport";
// import { cleanLayout } from "../../../../utils/cleanReport";
export default function Report({
  reportName = "",
  activeStep,
  zoomMultiplier = 1,
  handleStep = () => { },
}) {
  const dispatch = useDispatch();
  const currPage = useSelector(({ report }) => report.pageIdx);
  const gridContext = useRef({});
  const containerRef = useRef(null);
  const pageWidth = containerRef?.current?.clientWidth;

  const handleItemLoad = (id, isLoaded) => {
    dispatch({
      type: "SET_ITEM_LOADED",
      payload: {
        id,
        isLoaded,
      }
    })
  }

  const handleGridContext = (grid, pageIdx) => {
    gridContext.current = {
      ...gridContext.current,
      [pageIdx]: grid,
    };
  };

  const handleGridUpdate = (pageIdx) => {
    const currItems = gridContext?.current[pageIdx]?._items;
    const currItemsOrder = currItems.map((item) => item._id);
    const itemsMin = Math.min(...currItemsOrder);
    dispatch({
      type: "REORDER_REPORT_ITEMS",
      payload: {
        reportName,
        pageIdx,
        itemsMin,
        currItemsOrder,
      },
    });
  };

  const {
    handlePrint,
    handleRef
  } = usePrintReport({
    handleStep
  })

  return (
    <LayoutContainer ref={containerRef}>
      <ReportPage
        onMount={handleRef}
        key={`report-page-${reportName}-${currPage}`}
        pageIdx={currPage}
        {...{
          handleGridContext,
          handleGridUpdate,
          reportName,
          pageWidth,
          zoomMultiplier,
          handleItemLoad
        }}
      />
      <ErrorToast />
      <PrintModal {...{ handleStep, activeStep, handlePrint }} />
    </LayoutContainer>
  );
}

function PrintModal({
  handleStep,
  activeStep,
  handlePrint
}) {
  const dispatch = useDispatch();
  const pageIdx = useSelector(({ report }) => report.pageIdx);
  const isPrinting = useSelector(({ report }) => report.printStatus);
  const pageLength = useSelector(
    ({ report }) => report.reports?.[report.currentReport]?.layout?.length
  );

  const currPage = pageIdx === -1 ? pageIdx + 2 : pageIdx + 1;
  const progress = (currPage / pageLength)*100
  const handleCloseModal = () => {
    handleStep(activeStep - 1);
  }

  const handleCloseReport = () => {
    dispatch({
      type: 'TOGGLE_PANEL', payload: 'reportBuilder'
    })
  }
  // const report = useSelector(
  //   ({ report }) => report.reports?.[report.currentReport]);

  // const exportReport = () => {
  //   cleanLayout(report, true).then(r=>console.log(r))
  // }


  return (
    <Modal
      open={activeStep === 3}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={PrintModalStyle}>
        {isPrinting ? <>
          <LinearProgressWithLabel progress={progress} text={`Exporting ${currPage} of ${pageLength}`} />
          <Typography>
            <i>Please wait...</i>
          </Typography>
        </> : <><Typography>
          <i>Your report has been saved on this device.
            <br /><br />
            Click below to export your report as a PDF document or as images.</i>
        </Typography>
          <Stack gap={2} alignItems="center" sx={{ py: 2 }}>
            <Button
              variant="contained"
              onClick={() => handlePrint("PDF")}>
              Export Report as PDF
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePrint("JPG")}>
              Export Report as Images
            </Button>
            {/* <Button
              variant="contained"
              onClick={exportReport}>
              Share Report
            </Button> */}
            
          </Stack>
          <hr />
          <Stack gap={2} alignItems="center" sx={{ py: 2 }}>

            <Typography>
              <i>Click below to keep editing your report or close the report builder.</i>
            </Typography>
            <Button
              onClick={handleCloseModal} variant="outlined">
              Return to Report Builder
            </Button>
            <Button
              onClick={handleCloseReport} variant="outlined">
              Return to the Atlas
            </Button>
          </Stack></>}
      </Box>
    </Modal>)
}


function LinearProgressWithLabel({ progress, text }) {
  return (
    <Stack direction="column" gap={2} width="100%">
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}

function ErrorToast() {
  const dispatch = useDispatch();
  const error = useSelector(({ report }) => report.error);
  const { type, reportName, pageIdx } = error || {};

  const handleClose = () => {
    dispatch({
      type: "CLEAR_ERROR",
    });
  };

  const handleAddPage = () =>
    dispatch({
      type: "ADD_REPORT_PAGE",
      payload: {
        reportName,
      },
    });

  if (!error) return null;
  const messages = {
    "Invalid layout": `Page ${pageIdx + 1
      } is full! Resize, remove items, or add a new page.`,
  };
  const text = messages[type];

  return (
    <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="warning"
        sx={{ width: "100%" }}
        action={
          <Button color="inherit" size="small" onClick={handleAddPage}>
            Add Page
          </Button>
        }
      >
        {text}
      </Alert>
    </Snackbar>
  );
}
