import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportPage from "../ReportPage/ReportPage";
import {
  LayoutContainer,
  PrintContainer,
  PrintButton,
} from "./LayoutContainer";
import { Alert, Button, Snackbar } from "@mui/material";

export default function Report({
  reportName = "",
  activeStep,
  zoomMultiplier = 1,
}) {
  const dispatch = useDispatch();
  const currPage = useSelector(({ report }) => report.pageIdx);
  const gridContext = useRef({});
  const pagesRef = useRef({});
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

  const handleRef = (ref, idx) => {
    pagesRef.current = {
      ...pagesRef.current,
      [idx]: ref,
    };
  };
  
  const handlePrint = (fileType) => {
    import("html-to-image").then((htmlToImage) => {
      const { toSvg, toJpeg } = htmlToImage;
      import("downloadjs").then((downloadjs) => {
        const download = downloadjs.default;
        Object.values(pagesRef.current).forEach((pageRef, idx) => {
          try {
            if (fileType === "JPG") {
              toJpeg(pageRef.current, {
                fileName: `${reportName}-page-${idx + 1}.jpg`,
              }).then((data) => {
                download(
                  data,
                  `${reportName}-page-${idx + 1}.jpg`,
                  "image/jpeg"
                );
              });
            } else if (fileType === "PDF") {
              toSvg(pageRef.current, {
                fileName: `${reportName}-page-${idx + 1}.svg`,
              }).then((data) => {
                download(
                  data,
                  `${reportName}-page-${idx + 1}.svg`,
                  "image/svg+xml"
                );
              });
            }
          } catch {
            console.log("error");
          }
        });
      });
    });
  };
  return (
    <LayoutContainer ref={containerRef}>
      {activeStep === 3 && (
        <PrintContainer>
          <h2>Nice work!</h2>
          <h4>
            Your report has been saved. On your current device, come back to
            this page any time and select your report name from the 'Previous
            Reports' drop down to see up-to-date data.
          </h4>
          <p>
            Currently, you may export your report pages as JPGs. We plan to add
            an export feature as a single PDF. To leave the report builder,
            click 'finish' below.
          </p>
          <p>
            This new feature is an experimental feature, and we'd love to hear
            your feedback. Send us a message on our{" "}
            <a
              href={`${process.env.PUBLIC_URL}/contact`}
              target="_blank"
              rel="noreferrer"
            >
              contact page.
            </a>
          </p>
          <PrintButton onClick={() => handlePrint("JPG")}>
            Export JPGs
          </PrintButton>
          <PrintButton onClick={() => handlePrint("PDF")}>
            Export PDF
          </PrintButton>
          {/* <PrintButton onClick={() => handlePrint("PDF")}>
            Export PDF
          </PrintButton> */}
        </PrintContainer>
      )}
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
    </LayoutContainer>
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
    "Invalid layout": `Page ${
      pageIdx + 1
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
