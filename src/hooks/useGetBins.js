import { useState, useEffect} from "react";
import { fixedScales } from "../config/scales";

const getAsyncBins = async (geoda, mapParams, binData) =>
    mapParams.mapType === "natural_breaks"
        ? await geoda.quantileBreaks(mapParams.nBins, binData)
        : await geoda.hinge15Breaks(binData);

export default function useGetBins({
    currentData,
    mapParams,
    dataParams,
    binData,
    geoda,
    dataReady,
}) {
    const [bins, setBins] = useState({});
    const [binnedParams, setBinnedParams] = useState({
        mapParams: JSON.stringify(mapParams),
        dataParams: JSON.stringify(dataParams),
        dataReady,
        geoda: typeof geoda,
        currentData: null,
    });

    useEffect(() => {
        if (!dataReady) return;

        // if you already have bins....
        if (bins.bins && binnedParams.currentData === currentData) {
            if (
                binnedParams.mapParams === JSON.stringify(mapParams) &&
                binnedParams.dataReady === dataReady &&
                binnedParams.geoda === typeof geoda &&
                typeof geoda === "function" &&
                binnedParams.dataParams === JSON.stringify(dataParams)
            ) {
                console.log("same params");
                return;
            }

            if (
                mapParams.binMode !== "dynamic" &&
                JSON.stringify({
                    ...JSON.parse(binnedParams.mapParams),
                    ...JSON.parse(binnedParams.dataParams),
                    dIndex: 0,
                    nIndex: 0,
                }) ===
                JSON.stringify({ ...mapParams, ...dataParams, dIndex: 0, nIndex: 0 })
            ) {
                // console.log("diff params, not dynamic");
                return;
            }
        }
        if (mapParams.mapType === "lisa") {
            setBins(fixedScales["lisa"]);
            setBinnedParams({
                mapParams: JSON.stringify(mapParams),
                dataParams: JSON.stringify(dataParams),
                dataReady,
                geoda: typeof geoda,
                currentData,
            });
        } else if (
            dataParams.fixedScale !== null &&
            dataParams.fixedScale !== undefined &&
            fixedScales[dataParams.fixedScale]
        ) {
            setBins(fixedScales[dataParams.fixedScale]);
            setBinnedParams({
                mapParams: JSON.stringify(mapParams),
                dataParams: JSON.stringify(dataParams),
                dataReady,
                geoda: typeof geoda,
                currentData,
            });
        } else if (typeof geoda === "function") {
            // console.log("generating bins");
            getAsyncBins(geoda, mapParams, binData).then((nb) => {
                setBins({
                    bins:
                        mapParams.mapType === "natural_breaks"
                            ? nb
                            : [
                                "Lower Outlier",
                                "< 25%",
                                "25-50%",
                                "50-75%",
                                ">75%",
                                "Upper Outlier",
                            ],
                    breaks: nb,
                });
                setBinnedParams({
                    mapParams: JSON.stringify(mapParams),
                    dataParams: JSON.stringify(dataParams),
                    dataReady,
                    geoda: typeof geoda,
                    currentData,
                });
            });
        }
        return {};
    }, [
        JSON.stringify(mapParams),
        JSON.stringify(dataParams),
        typeof geoda,
        dataReady,
        currentData
    ]); //todo update depenency array if needed for some dataparam roperties
    return bins;
}