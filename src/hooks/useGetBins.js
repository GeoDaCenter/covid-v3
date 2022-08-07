import { useState, useEffect} from "react";
import { fixedScales } from "../config/scales";

const getAsyncBins = async (geoda, mapParams, binData, shouldSeparateZero) =>
    mapParams.mapType === "natural_breaks"
        ? await geoda.naturalBreaks(mapParams.nBins, binData)
        : await geoda.hinge15Breaks(binData);

export default function useGetBins({
    currentData,
    mapParams,
    dataParams,
    binData,
    geoda,
    geodaReady,
    dataReady,
    shouldSeparateZero
}) {
    const [bins, setBins] = useState({});
    const [binnedParams, setBinnedParams] = useState({
        mapParams: JSON.stringify(mapParams),
        dataParams: JSON.stringify(dataParams),
        dataReady,
        geodaReady,
        currentData: null,
    });

    useEffect(() => {
        if (!dataReady) return;

        // if you already have bins....
        if (bins.bins && binnedParams.currentData === currentData) {
            if (
                geodaReady &&
                binnedParams.mapParams === JSON.stringify(mapParams) &&
                binnedParams.dataReady === dataReady &&
                binnedParams.geodaReady === geodaReady &&
                binnedParams.dataParams === JSON.stringify(dataParams)
            ) {
                // console.log("same params");
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
                geodaReady,
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
                geodaReady,
                currentData,
            });
        } else if (geodaReady) {
            const filteredData = shouldSeparateZero 
                ? binData.filter(d => d !== 0) 
                : binData
                
            getAsyncBins(geoda, mapParams, filteredData).then((nb) => {
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
                    geodaReady,
                    currentData,
                });
            });
        }
        return {};
    }, [
        JSON.stringify(mapParams),
        JSON.stringify(dataParams),
        geodaReady,
        dataReady,
        currentData
    ]); //todo update depenency array if needed for some dataparam roperties
    return bins;
}