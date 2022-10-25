import { useState, useEffect } from 'react'
import { fixedScales } from '../config/scales'

/**
 * Helper function for useGetBins. Returns the bins for a 1D dataset
 *
 * @category Utils/Data
 * @param {Object} geoda Jsgeoda instance
 * @param {Object} mapParams MapParamsSpec - see
 *   {@link src/stores/paramsStore/type.ts}
 * @param {number[]} binData One dimensional array of data
 * @param {boolean} shouldSeparateZero Deprecated - not used.
 * @returns {Promise} Promise object of jsgeoda data return
 */
const getAsyncBins = async (geoda, mapParams, binData, shouldSeparateZero) =>
    mapParams.mapType === 'natural_breaks'
        ? await geoda.naturalBreaks(mapParams.nBins, binData)
        : await geoda.hinge15Breaks(binData)

/**
 * Hook to get jsgeoda bins for a given set of parameters
 *
 * @category Hooks
 * @param {Object} props
 * @param {string} props.currentData - Name of the current geojson data
 * @param {Object} props.mapParams - MapParamsSpec - see
 *   {@link src/stores/paramsStore/type.ts}
 * @param {Object} props.dataParams - DataParamsSpec - see
 *   {@link src/stores/paramsStore/type.ts}
 * @param {number[]} props.binData - One dimensional array of data
 * @param {Object} props.geoda - Jsgeoda instance
 * @param {boolean} props.geodaReady Flat to indicate if geoda is ready
 * @param {boolean} props.dataReady Flat to indicate if data is ready
 * @param {boolean} props.shouldSeparateZero Flat to indicate if zero values
 *   should be separated
 * @returns {Bins} Bins result {bins: string[], breaks: number[]}
 */
export default function useGetBins({
    currentData,
    mapParams,
    dataParams,
    binData,
    geoda,
    geodaReady,
    dataReady,
    shouldSeparateZero,
}) {
    const [bins, setBins] = useState({})
    const [binnedParams, setBinnedParams] = useState({
        mapParams: JSON.stringify(mapParams),
        dataParams: JSON.stringify(dataParams),
        dataReady,
        geodaReady,
        currentData: null,
    })

    useEffect(() => {
        if (!dataReady) return

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
                return
            }

            if (
                mapParams.binMode !== 'dynamic' &&
                JSON.stringify({
                    ...JSON.parse(binnedParams.mapParams),
                    ...JSON.parse(binnedParams.dataParams),
                    dIndex: 0,
                    nIndex: 0,
                }) ===
                    JSON.stringify({
                        ...mapParams,
                        ...dataParams,
                        dIndex: 0,
                        nIndex: 0,
                    })
            ) {
                // console.log("diff params, not dynamic");
                return
            }
        }
        if (mapParams.mapType === 'lisa') {
            setBins(fixedScales['lisa'])
            setBinnedParams({
                mapParams: JSON.stringify(mapParams),
                dataParams: JSON.stringify(dataParams),
                dataReady,
                geodaReady,
                currentData,
            })
        } else if (
            dataParams.fixedScale !== null &&
            dataParams.fixedScale !== undefined &&
            fixedScales[dataParams.fixedScale]
        ) {
            setBins(fixedScales[dataParams.fixedScale])
            setBinnedParams({
                mapParams: JSON.stringify(mapParams),
                dataParams: JSON.stringify(dataParams),
                dataReady,
                geodaReady,
                currentData,
            })
        } else if (geodaReady) {
            const filteredData = shouldSeparateZero
                ? binData.filter((d) => d !== 0)
                : binData

            getAsyncBins(geoda, mapParams, filteredData).then((nb) => {
                setBins({
                    bins:
                        mapParams.mapType === 'natural_breaks'
                            ? nb
                            : [
                                  'Lower Outlier',
                                  '< 25%',
                                  '25-50%',
                                  '50-75%',
                                  '>75%',
                                  'Upper Outlier',
                              ],
                    breaks: nb,
                })
                setBinnedParams({
                    mapParams: JSON.stringify(mapParams),
                    dataParams: JSON.stringify(dataParams),
                    dataReady,
                    geodaReady,
                    currentData,
                })
            })
        }
        return {}
    }, [
        JSON.stringify(mapParams),
        JSON.stringify(dataParams),
        geodaReady,
        dataReady,
        currentData,
    ]) //todo update depenency array if needed for some dataparam roperties
    return bins
}

/**
 * @typedef {Object} Bins
 * @property {string[]} bins - Array of bin names
 * @property {number[]} breaks - Array of bin breaks
 */
