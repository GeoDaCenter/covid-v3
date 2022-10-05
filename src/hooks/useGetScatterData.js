import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stitch } from '../utils'
import useGetVariable from './useGetVariable'
import { paramsSelectors } from '../stores/paramsStore'
import { dataSelectors } from '../stores/dataStore'
const { selectGeojsonData } = dataSelectors
const { selectCurrentData } = paramsSelectors

/**
 * Hook to get scatterplot XY data
 * 
 * @category Hooks
 * @param {Object} props
 * @param {string} props.xAxis - X-axis variable
 * @param {string} props.yAxis - Y-axis variable
 * @returns {ScatterData}
 */
function useGetScatterData({ xAxisVar, yAxisVar }) {
    // pieces of redux state
    const currentData = useSelector(selectCurrentData)
    const geojsonData = useSelector(selectGeojsonData(currentData))

    const [data, setData] = useState({
        data: [],
        timestamp: null,
    })
    const xData = useGetVariable({
        variable: xAxisVar,
    })
    const yData = useGetVariable({
        variable: yAxisVar,
    })

    useEffect(() => {
        if (xData?.length && yData?.length) {
            setData(
                stitch(
                    xData,
                    yData,
                    geojsonData?.order?.indexOrder &&
                        Object.values(geojsonData.order.indexOrder)
                )
            )
        }
    }, [JSON.stringify(xData), JSON.stringify(yData)])

    return {
        scatterData: data.data,
        timestamp: data.timestamp,
    }
}

/**
 * @typedef {Object} ScatterData
 * @property {Array} scatterData - Array of objects with x and y properties
 * @property {number} timestamp - Timestamp of data
 */

export default useGetScatterData
