import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { findIn, findAllDefaults } from '../utils'
import dataDateRanges from '../config/dataDateRanges'
import { paramsSelectors } from '../stores/paramsStore'
import { dataSelectors } from '../stores/dataStore'
const { selectGeojsonData } = dataSelectors;
const {
  selectCurrentData,
  selectDatasets,
  selectDataParams,
  selectTables,
  selectSelectionKeys
} = paramsSelectors
/**
 * Async function for fetch relevant data
 *
 * See useGetLineChartData comments for schemas
 *
 * @param {Object} props
 * @param {string} props.currentGeojson Current map data
 * @param {string} props.currentTimeseriesDataset Current timeseries data
 * @param {number[]} props.selectionKeys List of ID keys (optional)
 * @param {number} props.totalPopulation Total population for normalization
 * @returns {TimeSeriesData} Chart data, maximums, and relevant metadata, as
 *   below
 */
async function fetchTimeSeries({
  currentGeojson,
  currentTimeseriesDataset,
  selectionKeys,
  totalPopulation,
}) {
  const keysToFetch = selectionKeys.length
    ? [currentTimeseriesDataset, ...selectionKeys]
    : [currentTimeseriesDataset]
  const timeseriesData = await Promise.allSettled(
    keysToFetch.map((key, idx) =>
      fetch(`${process.env.PUBLIC_URL}/timeseries/${key}.json`).then((r) =>
        r.json()
      )
    )
  )

  let chartData = []
  for (let i = 0; i < keysToFetch.length; i++) {
    const id = keysToFetch[i]
    const data =
      i === 0
        ? timeseriesData[i].value
        : timeseriesData[i].value[currentTimeseriesDataset]
    if (i === 0) {
      const pop = totalPopulation
      for (let j = 0; j < data.dates.length; j++) {
        const delta1 = j === 0 ? 0 : 1
        const delta2 = j < 6 ? j : 7
        chartData.push({
          date: data.dates[j],
          sum: data.sumData[j],
          sum100k: (data.sumData[j] / pop) * 100000,
          daily: data.sumData[j] - data.sumData[j - delta1],
          daily100k:
            ((data.sumData[j] - data.sumData[j - delta1]) / pop) * 100000,
          weekly: (data.sumData[j] - data.sumData[j - delta2]) / 7,
          weekly100k:
            (((data.sumData[j] - data.sumData[j - delta2]) / pop) * 100000) / 7,
        })
      }
    } else {
      const pop = currentGeojson[id].population
      for (let j = 0; j < data.length; j++) {
        const delta1 = j === 0 ? 0 : 1
        const delta2 = j < 6 ? j : 7
        chartData[j] = {
          ...chartData[j],
          keySum: chartData[j]?.keySum || 0 + data[j],
          keySum100k: chartData[j]?.keySum100k || 0 + (data[j] / pop) * 100000,
          keyDaily: chartData[j]?.keyDaily || 0 + (data[j] - data[j - delta1]),
          keyDaily100k:
            chartData[j]?.keyDaily100k ||
            0 + ((data[j] - data[j - delta1]) / pop) * 100000,
          keyWeekly:
            chartData[j]?.keyWeekly || 0 + (data[j] - data[j - delta2]) / 7,
          keyWeekly100k:
            chartData[j]?.keyWeekly100k ||
            0 + (((data[j] - data[j - delta2]) / pop) * 100000) / 7,
          [`${id}Sum`]: data[j],
          [`${id}Sum100k`]: (data[j] / pop) * 100000,
          [`${id}Daily`]: data[j] - data[j - delta1],
          [`${id}Daily100k`]: ((data[j] - data[j - delta1]) / pop) * 100000,
          [`${id}Weekly`]: (data[j] - data[j - delta2]) / 7,
          [`${id}Weekly100k`]:
            (((data[j] - data[j - delta2]) / pop) * 100000) / 7,
        }
      }
    }
  }

  let maximums = {
    sum: chartData.slice(-1)[0].sum,
    sum100k: chartData.slice(-1)[0].sum100k,
    idSum: Math.max(
      ...keysToFetch.slice(1).map((id) => chartData.slice(-1)[0][`${id}Sum`])
    ),
    idSum100k: Math.max(
      ...keysToFetch
        .slice(1)
        .map((id) => chartData.slice(-1)[0][`${id}Sum100k`])
    ),
    keySum: chartData.slice(-1)[0].keySum,
    keySum100k: chartData.slice(-1)[0].keySum100k,
  }
  for (let i = 0; i < chartData.length; i++) {
    maximums.daily = Math.max(chartData[i].daily, maximums.daily || 0)
    maximums.daily100k = Math.max(
      chartData[i].daily100k,
      maximums.daily100k || 0
    )
    maximums.weekly = Math.max(chartData[i].weekly, maximums.weekly || 0)
    maximums.weekly100k = Math.max(
      chartData[i].weekly100k,
      maximums.weekly100k || 0
    )
    maximums.keyDaily = Math.max(chartData[i].keyDaily, maximums.keyDaily || 0)
    maximums.keyDaily100k = Math.max(
      chartData[i].keyDaily100k,
      maximums.keyDaily100k || 0
    )
    maximums.keyWeekly = Math.max(
      chartData[i].keyWeekly,
      maximums.keyWeekly || 0
    )
    maximums.keyWeekly100k = Math.max(
      chartData[i].keyWeekly100k,
      maximums.keyWeekly100k || 0
    )
    maximums.idDaily = Math.max(
      ...keysToFetch.slice(1).map((id) => chartData[i][`${id}Daily`]),
      maximums.idDaily || 0
    )
    maximums.idDaily100k = Math.max(
      ...keysToFetch.slice(1).map((id) => chartData[i][`${id}Daily100k`]),
      maximums.idDaily100k || 0
    )
    maximums.idWeekly = Math.max(
      ...keysToFetch.slice(1).map((id) => chartData[i][`${id}Weekly`]),
      maximums.idWeekly || 0
    )
    maximums.idWeekly100k = Math.max(
      ...keysToFetch.slice(1).map((id) => chartData[i][`${id}Weekly100`]),
      maximums.idWeekly100k || 0
    )
  }

  return {
    maximums,
    chartData,
  }
}

/**
 * Hook to get line chart data given a particular variable and GEOID or GEOIDS
 * By default, this will provide national data. If keys are provided, properties
 * for the total of all keys will be provided as keySum, keyDaily... And
 * properties for will be provided for each key as {key}Sum, {key}Daily, eg.
 * "01001Sum", "01001Daily"
 *
 * @category Hooks
 * @param {Object} props
 * @param {string} props.table - 'cases' | 'deaths' | 'vaccination' The table to
 *   fetch data from
 * @param {string[]} props.geoid The county or state GEOID to fetch data for
 * @returns {LineChartData} Chart data, maximums, and relevant metadata
 * @subcategory Data
 */
function useGetLineChartData({ table = 'cases', geoid = [] }) {
  const [data, setData] = useState({
    maximums: {},
    chartData: [],
  })

  // pieces of redux state
  const currentData = useSelector(selectCurrentData)
  const datasets = useSelector(selectDatasets)
  const dataParams = useSelector(selectDataParams)
  const tables = useSelector(selectTables)
  const stateKeys = useSelector(selectSelectionKeys)
  const selectionKeys = geoid.length ? geoid : stateKeys

  // current state data params
  const currDataset = findIn(datasets, 'file', currentData)
  const currTables = [
    ...Object.values(currDataset.tables).map((tableId) =>
      findIn(tables, 'id', tableId)
    ),
    ...findAllDefaults(tables, currDataset.geography).map((dataspec) => ({
      ...dataspec,
    })),
  ].filter(
    (entry, index, self) =>
      self.findIndex((f) => f.table === entry.table) === index
  )

  const currentTimeseriesDataset = currTables.find(
    (t) => t.table === table
  )?.name

  const storedGeojson = useSelector(selectGeojsonData(currentData))
  const currentGeojson = storedGeojson?.properties

  const getName = ['County'].includes(currDataset.geography)
    ? (key) =>
        currentGeojson?.[key]?.NAME + ', ' + currentGeojson?.[key]?.state_abbr
    : (key) => currentGeojson?.[key]?.NAME
  
  const selectionNames = selectionKeys.map(getName)
  const totalPopulation =
    currentGeojson &&
    Object.values(currentGeojson).reduce(
      (acc, curr) => acc + curr.population,
      0
    )

  useEffect(() => {
    if (totalPopulation && currentGeojson) {
      fetchTimeSeries({
        currentGeojson,
        currentTimeseriesDataset,
        selectionKeys,
        totalPopulation,
      }).then((data) => setData(data))
    }
  }, [JSON.stringify(selectionKeys), totalPopulation, table])

  const currIndex = dataParams.nType.includes('time')
    ? dataParams.nIndex === null
      ? dataDateRanges[currentTimeseriesDataset].lastIndexOf(1)
      : dataParams.nIndex
    : false

  return {
    ...data,
    isTimeseries: dataParams.nType.includes('time'),
    selectionKeys,
    selectionNames,
    currRange: dataParams.nType.includes('time')
      ? dataParams.nRange || dataParams.nIndex
      : false,
    currIndex,
    currentData,
  }
}

export default useGetLineChartData

/**
 * @typedef {ChartDataEntry[]} ChartDataSchema Series long format timeseries
 *   data, suitable for use in d3/recharts viz.
 */

/**
 * @typedef {Object} ChartDataEntry Single entry of long format timeseries data,
 *   suitable for use in d3/recharts viz.
 * @property {number} date - Date for this row of data
 * @property {number} sum - Total sum of the variable for this date
 * @property {number} sum100k - Total sum of the variable for this date, per
 *   100k people
 * @property {number} daily - Daily sum of the variable for this date
 * @property {number} daily100k - Daily sum of the variable for this date, per
 *   100k people
 * @property {number} weekly - Weekly sum of the variable for this date
 * @property {number} weekly100k - Weekly sum of the variable for this date, per
 *   100k people ...
 */

/**
 * @typedef {Object} MaximumsDataSchema Summary data of maximum values for each
 *   property in ChartdataSchema, in addition to properties including keyDaily,
 *   keyWeekly... for individual GEOIDs and idDaily, idWeekly... for the sum of
 *   GEOIDs
 * @property {number} sum - Highest value
 * @property {number} sum100k - Total sum of the variable for this date, per
 *   100k people
 * @property {number} daily - Daily sum of the variable for this date
 * @property {number} daily100k - Daily sum of the variable for this date, per
 *   100k people
 * @property {number} weekly - Weekly sum of the variable for this date
 * @property {number} weekly100k - Weekly sum of the variable for this date, per
 *   100k people ...
 */

/**
 * @typedef {Object} LineChartData Return shape of useGetLineChartdata
 * @property {Object[]} chartData - See ChartDataSchema
 * @property {Object} maximums - See MaximumsDataSchema
 * @property {string} currentData - Current map data
 * @property {number} currIndex - Current date index
 * @property {number} currRange - Current date range
 * @property {number[]} selectionKeys - List of selected GEOID ids / key
 * @property {string[]} selectionNames - List of selected geography names
 */

/**
 * @typedef {Object} TimeSeriesData Return shape of fetchTimeSeries
 * @property {Object[]} chartData - See ChartDataSchema
 * @property {Object} maximums - See MaximumsDataSchema
 */
