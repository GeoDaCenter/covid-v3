import { useState, useEffect } from 'react'
import { useGeoda } from '../contexts/Geoda'
import { useDispatch, useSelector } from 'react-redux'
import { dataSelectors, dataActions } from '../stores/dataStore'
const { selectGeojsonData } = dataSelectors
const { addWeights } = dataActions

/**
 * @typedef {Object} LisaReturnData
 * @property {Object} lisaData - Jsgeoda lisa object
 * @property {number[]} lisaData.clusters - Array of LISA values
 * @property {number[]} lisaData.pvalues - Array of p-values See more at
 *   https://xunli.gitbook.io/jsgeoda/local-spatial-autocorrelation/local-moran
 * @property {boolean} shouldCacheWeights - Boolean to indicate if weights
 *   should be cached
 * @property {Object} weights - Jsgeoda weights object
 * @property {string} weights.uid - UID for generated weights
 * @property {string} weights.mapUid - UID of map / geojson
 */

/**
 * Async helper function to calculalate lisa map
 *
 * @category Utils/Map
 * @param {string} currentGeojson - Name of the current geojson in the redux
 *   store
 * @param {Object} geoda - Jsgeoda instance
 * @param {number[]} dataForLisa - Data for jgeoda, ordered by geojson order
 * @returns {LisaReturnData} - Lisa data and weights
 */
const getLisa = async (currentGeojson, geoda, dataForLisa) => {
    const weights =
        currentGeojson && 'Queen' in currentGeojson.weights
            ? currentGeojson.weights.Queen
            : await geoda.getQueenWeights(currentGeojson.mapId)
    const lisaValues = await geoda.localMoran(weights, dataForLisa)

    return {
        lisaValues,
        shouldCacheWeights: !('Queen' in currentGeojson.weights),
        weights,
    }
}
/**
 * Hook to simplify use of jsgeoda lisa/hotspot map
 * 
 * @category Hooks
 * @param {Object} props
 * @param {string} props.currentData - Name of the current dataset
 * @param {number[]} props.dataForLisa - Data for jgeoda, ordered by geojson
 *   order
 * @param {boolean} props.shouldUseLisa - Boolean to indicate if lisa should be
 *   used
 * @param {string} props.varId - Hash of the current variable and properties
 * @param {boolean} props.dataReady - Flag to indicate if data is ready
 * @returns {Array} Positional data return for easy renaming [clusterArray:
 *   number[], mapVariableHash: string]
 */
function useLisaMap({
    currentData,
    dataForLisa = [],
    shouldUseLisa = false,
    varId,
    dataReady,
}) {
    const { geoda, geodaReady } = useGeoda()
    const dispatch = useDispatch()
    const geojsonData = useSelector(selectGeojsonData(currentData))

    const [data, setData] = useState({
        lisaData: [],
        lisaVarId: '',
    })
    useEffect(() => {
        if (
            shouldUseLisa &&
            geodaReady &&
            dataForLisa.length &&
            geojsonData?.weights &&
            dataReady
        ) {
            getLisa(geojsonData, geoda, dataForLisa).then(
                ({ lisaValues, shouldCacheWeights, weights }) => {
                    setData({
                        lisaData: lisaValues.clusters,
                        lisaVarId: varId,
                    })
                    if (shouldCacheWeights) {
                        dispatch(
                            addWeights({
                                id: currentData,
                                weights,
                            })
                        )
                    }
                }
            )
        } else {
            return null
        }
    }, [geodaReady, currentData, shouldUseLisa, varId, dataReady])
    return [data.lisaData, data.lisaVarId]
}

export default useLisaMap
