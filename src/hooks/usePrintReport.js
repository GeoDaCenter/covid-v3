import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import download from "downloadjs";
import { toJpeg } from "html-to-image";

export function usePrintReport() {
    const isPrinting = useSelector(({ report }) => report.printStatus);
    const printFileType = useSelector(({ report }) => report.printFileType);
    const currentReport = useSelector(({ report }) => report.currentReport);
    const pageLength = useSelector(
        ({ report }) => report.reports?.[report.currentReport]?.layout?.length
    );
    const pageIdx = useSelector(({ report }) => report.pageIdx);
    const pageIsLoaded = useSelector(({ report }) => report.loadState.isLoaded);

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
        if(isPrinting){
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
            doc.addImage(page, 'JPEG', 0, 0, 8.5, 11, null, 'NONE')
            i < pageLength -1 && doc.addPage()
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
                const jpg = await toJpeg(currentPageRef.current)
                handleAddPageData(jpg)
                break
            }
            case "JPG": {
                const jpg = await toJpeg(currentPageRef.current)
                return await download(jpg, `${currentReport}-page-${pageIdx + 1}.jpg`, "image/jpeg");
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

    return {
        handlePrint,
        handleRef,
    };
}