import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import download from "downloadjs";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { reportSelectors } from "../stores/reportStore";
const { selectPrintStatus, selectCurrentPage, selectIsLoaded, selectCurrentReport, selectPrintFileType, selectcurrentReportLength } = reportSelectors;

export function usePrintReport() {
    const isPrinting = useSelector(selectPrintStatus);
    const printFileType = useSelector(selectPrintFileType);
    const currentReport = useSelector(selectCurrentReport);
    const pageLength = useSelector(selectcurrentReportLength);
    const pageIdx = useSelector(selectCurrentPage);
    const pageIsLoaded = useSelector(selectIsLoaded);

    const currentPageRef = useRef(null);
    const [pageData, setPageData] = useState([]);
    const [shouldPrintPdf, setShouldPrintPdf] = useState(false);

    const dispatch = useDispatch();
    const handleRef = (ref) => (currentPageRef.current = ref);
    const handleAddPageData = (data) => setPageData((prev) => [...prev, data]);
    const handleResetPdfPrint = () => {
        setPageData([]);
        setShouldPrintPdf(false);
    }

    const setPageIdx = (page) => {
        dispatch({
            type: "SET_PAGE_IDX",
            payload: page,
        });
    };

    const incrementPage = () => {
        if (pageIdx < pageLength - 1) {
            setPageIdx(pageIdx + 1);
        } else {
            handleEndPrinting()
        }
    }
    const handlePrint = (fileType) => {
        dispatch({
            type: "SET_PRINTING_STATUS",
            payload: {
                status: true,
                fileType
            }
        })
    };
    const handleStopPrint = () => {
        if (isPrinting) {
            dispatch({
                type: "SET_PRINTING_STATUS",
                payload: {
                    status: false
                }
            })
        }
    };


    const handleSavePdf = async () => {
        const jspdf = await import('jspdf')
        const jsPDF = jspdf.jsPDF
        const doc = new jsPDF({
            format: 'letter',
            unit: "in"
        })
        pageData.forEach((page, i) => {
            doc.addImage(page, 0, 0, 8.5, 11)
            i < pageLength - 1 && doc.addPage()
        });
        doc.save(`${currentReport}.pdf`);
    }

    const handleEndPrinting = async () => {
        switch (printFileType) {
            case "PDF":
                setShouldPrintPdf(true)
                break;
            default:
                handleStopPrint()
                break;
        }
    }

    const printPage = async () => {
        switch (printFileType) {
            case "PDF": {
                const png = await toPng(currentPageRef.current, { pixelRatio: 2 })
                handleAddPageData(png)
                break
            }
            case "JPG": {
                const jpg = await toJpeg(currentPageRef.current, { pixelRatio: 2 })
                return await download(jpg, `${currentReport}-page-${pageIdx + 1}.jpg`, "image/jpeg");
            }
            case "PNG": {
                const png = await toPng(currentPageRef.current, { pixelRatio: 2 })
                return await download(png, `${currentReport}-page-${pageIdx + 1}.png`, "image/png");
            }
            case "SVG": {
                const svg = await toSvg(currentPageRef.current, { fontEmbedCSS: false, skipFonts: true })
                // doing this the ol' fashioned way due to issues with SVG encoding :)
                let link = document.createElement("a");
                document.body.appendChild(link);
                link.setAttribute("href", svg);
                link.setAttribute("download", `${currentReport}-page-${pageIdx + 1}.svg`);
                link.click();
                link.remove();
                return;
            }
            default:
                break;
        }
    }

    useEffect(() => {
        if (pageIdx === -1) {
            incrementPage()
        } else if (isPrinting && pageIsLoaded) {
            printPage().then(() => incrementPage())
        }
    }, [isPrinting, pageIdx, pageIsLoaded]);

    useEffect(() => {
        if (shouldPrintPdf && pageData.length === pageLength) {
            handleSavePdf().then(() => {
                handleStopPrint()
                handleResetPdfPrint()
            })
        }
    }, [shouldPrintPdf, pageData.length])

    useEffect(() => {
        handleStopPrint()
    }, [currentReport])

    return {
        handlePrint,
        handleRef,
    };
}