import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  findIn,
  getDateLists,
  getDataForBins,
  getFetchParams,
  findSecondaryMonth,
  getClosestIndex,
  onlyUniqueArray,
} from "../utils";
import useGetTable from "./useGetTable";
import { paramsSelectors } from '../stores/paramsStore';
import { dataSelectors } from '../stores/dataStore'
const { selectGeojson } = dataSelectors;
const { selectCurrentData, selectDataParams, selectDatasets, selectTables, selectVariables } = paramsSelectors;
const dateLists = getDateLists();

/**
 * Hook to get a variable, returning a 1 dimensional array of values. Arguments use predefined variable names, dataset selection, and date index.
 * 
 * @category Hooks
 * @param {Object} props 
 * @param {string} props.variable - Name of the variable to get data for
 * @param {string} props.dataset - Name of the geojson dataset to use when using a multi-dataset variable (cases and deaths)
 * @param {number} props.dateIndex - Index of the date to use -- days since 01/21/2020 
 * @returns {Array} - A 1 dimensional array of data for the variable, ordered by the geojson features
 */
function useGetVariable({
  variable,
  // priorityLoad = false,
  dataset = false,
  dateIndex = false,
}) {
  const canLoadInBackground = useSelector(
    ({ data }) => data.canLoadInBackground
  );
  // pieces of redux state
  const stateDataset = useSelector(selectCurrentData);
  const currentData = dataset || stateDataset;
  const geojsonData = useSelector(selectGeojson(currentData));
  const dataParams = useSelector(selectDataParams);
  const datasets = useSelector(selectDatasets);
  const tables = useSelector(selectTables);
  const variables = useSelector(selectVariables);
  // current state data params

  const params = findIn(variables, "variableName", variable);
  const currDataset = findIn(datasets, "file", currentData);

  const [nIsTimeSeries, dIsTimeSeries] = [
    params?.nType && params.nType.includes("time"),
    params?.dType && params.dType.includes("time"),
  ];
  const isTimeSeries = nIsTimeSeries || dIsTimeSeries;

  const [defaultNumeratorParams, defaultDenominatorParams] = [
    params,
    params,
  ].map((dataParams, i) =>
    getFetchParams({
      dataParams,
      tables,
      currDataset,
      predicate: i === 1 ? "denominator" : "numerator",
      dateList: dateLists["isoDateList"],
    })
  );

  const currIndex = isTimeSeries
    ? getClosestIndex(
        dateIndex || dataParams.nIndex || dataParams.dIndex,
        defaultNumeratorParams.name || ""
      ) || 30
    : null;
  const currRangeIndex = currIndex - (dataParams.nRange || dataParams.dRange);
  const currTimespans = [currIndex, currRangeIndex]
    .map((index) => [
      !currIndex || dateLists.isoDateList.length - index < 30
        ? "latest"
        : dateLists.isoDateList[index]?.slice(0, 7),
      !currIndex || dateLists.isoDateList.length - index < 30
        ? false
        : findSecondaryMonth(index, dateLists.isoDateList),
    ])
    .flat()
    .filter((f) => !!f)
    .filter(onlyUniqueArray);
  const fetchParams = [defaultNumeratorParams, defaultDenominatorParams].map(
    (params) =>
      currTimespans.map((timespan, i) => ({
        ...params,
        timespan,
      }))
  );

  const [[numData, numReady], [denData, denReady]] = [
    useGetTable({
      filesToFetch: fetchParams[0],
      shouldFetch: canLoadInBackground,
      dateLists,
    }),
    useGetTable({
      filesToFetch: fetchParams[1],
      shouldFetch: canLoadInBackground,
      dateLists,
    }),
  ];

  const data = useMemo(() =>
    getDataForBins({
      numeratorData:
        params.numerator === "properties"
          ? geojsonData?.properties
          : numData?.data,
      denominatorData:
        params.denominator === "properties"
          ? geojsonData?.properties
          : denData?.data,
      dataParams: params,
      binIndex: currIndex,
      fixedOrder:
        geojsonData?.order?.indexOrder &&
        Object.values(geojsonData.order.indexOrder),
      dataReady: numReady && denReady,
    })
  );

  return data;
}

export default useGetVariable;