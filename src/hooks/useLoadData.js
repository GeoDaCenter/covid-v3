import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {
  findIn,
  getDateLists,
  getFetchParams,
  findSecondaryMonth,
  onlyUniqueArray,
  getClosestIndex
} from "../utils";
import { useGeoda } from "../contexts/Geoda";
import useGetTable from "./useGetTable";
import useGetGeojson from "./useGetGeojson";
import useBackgroundLoadData from "./useBackgroundLoadData";
import dataDateRanges from "../config/dataDateRanges";

const dateLists = getDateLists();

// fetch params spec
// {
//   file: 'covid_confirmed_usafacts.latest.pbf',
//   name: '',
//    type:'pbf',
//  timespan: 'latest'
// dates: 'ISO' or 'US'
// accumulate: yeah or nea
// }

export default function useLoadData({
  dataParams,
  currentData
}) {
  // pieces of redux state
  const dispatch = useDispatch();
  const { geoda, geodaReady } = useGeoda();
  const storedGeojson = useSelector(({data}) => data.storedGeojson);
  const canLoadInBackground = useSelector(({data}) => data.canLoadInBackground);
  const datasets = useSelector(({params}) => params.datasets);
  const tables = useSelector(({params}) => params.tables);
  // const dataParams = useSelector(({params}) => params.dataParams);
  // const currentData = useSelector(({params}) => params.currentData);
  // const dynamicBinning = useSelector(({params}) => params.mapParams.binMode === "dynamic");
  const firstLoad = useRef(true)

  // current state data params
  const currDataset = findIn(datasets, "file", currentData);
  const [nIsTimeSeries, dIsTimeSeries] = [
    dataParams?.nType && dataParams.nType.includes("time"),
    dataParams?.dType && dataParams.dType.includes("time")
  ]
  const isTimeSeries =  nIsTimeSeries || dIsTimeSeries;

  const defaultNumeratorParams = getFetchParams({
    dataParams,
    tables,
    currDataset,
    predicate: "numerator",
    dateList: dateLists["isoDateList"]
  });

  const defaultDenominatorParams = getFetchParams({
    dataParams,
    tables,
    currDataset,
    predicate: "denominator",
    dateList: dateLists["isoDateList"]
  });

  const currIndex = isTimeSeries
    ? getClosestIndex(dataParams.nIndex || dataParams.dIndex, defaultNumeratorParams.name||'')||30
    : null

  const currRangeIndex = currIndex - (dataParams.nRange || dataParams.dRange) 
  const currDatesAvailable = dataDateRanges[defaultNumeratorParams?.name?.split('.')[0]];
  const latestAvailableDate = currDatesAvailable && currDatesAvailable.length
    ? currDatesAvailable.length - [...currDatesAvailable].reverse().findIndex(f => f === 1)
    : null
    
  const binTimespans = [
    "latest", 
    dateLists.isoDateList[latestAvailableDate-(dataParams.nRange || dataParams.dRange)]?.slice(0, 7), 
    findSecondaryMonth(latestAvailableDate-(dataParams.nRange || dataParams.dRange), dateLists.isoDateList)
  ]
  const mapTimespans = [currIndex, currRangeIndex].map(index => [
    !currIndex || latestAvailableDate - index < 30
      ? "latest"
      : dateLists.isoDateList[index]?.slice(0, 7),
    !currIndex || latestAvailableDate - index < 30
      ? null
      : findSecondaryMonth(index, dateLists.isoDateList)
  ]).flat()
  
  const currTimespans = [...binTimespans, ...mapTimespans].filter(f => !!f).filter(onlyUniqueArray);

  const [numeratorParams, denominatorParams] = [
    currTimespans.map(timespan => ({...defaultNumeratorParams, timespan})),
    currTimespans.map(timespan => ({...defaultDenominatorParams, timespan}))
  ]
  
  const [numeratorData, numeratorDataReady] = useGetTable({
    filesToFetch: numeratorParams,
    shouldFetch: true,
    dateLists
  });

  const [denominatorData, denominatorDataReady] =
    useGetTable({
      filesToFetch: denominatorParams,
      shouldFetch: true,
      dateLists
    });
  const [geojsonData, geojsonDataReady] = useGetGeojson({
    geoda,
    geodaReady,
    currDataset,
    storedGeojson
  });
  
  const dateIndices = numeratorData ? numeratorData.dates : null;

  // First load fix numerator index
  useEffect(() => {
    if (firstLoad.current && numeratorData?.dates && numeratorData.dates.slice(-1)[0]) {
      dispatch({
        type: "SET_DATA_PARAMS",
        payload: {
          nIndex: numeratorData.dates.slice(-1)[0],
        },
      });
      firstLoad.current = false;
    }
  }, [numeratorData && (numeratorData?.dates && numeratorData.dates.slice(-1)[0])]);

  useEffect(() => {
    dispatch({
      type:'SET_CAN_LOAD_IN_BACKGROUND',
      payload: !!numeratorDataReady && !!denominatorDataReady && !!geojsonDataReady
    })
  }, [numeratorDataReady, denominatorDataReady, geojsonDataReady]);
  
  // const {// isBackgroundLoading: adjacentMonthLoading
  // } =
  useBackgroundLoadData({
    currentGeography: currDataset.geography,
    tables: tables.filter(({name}) => (!defaultNumeratorParams.name || defaultNumeratorParams.name === name) && (!defaultDenominatorParams.name || defaultDenominatorParams.name === name)),
    shouldFetch: !!numeratorDataReady && !!denominatorDataReady && !!geojsonDataReady,
    currTimespans,
    dateLists,
    numeratorParams,
    denominatorParams,
    adjacentMonths: [
      dateLists.isoDateList[currIndex-30]?.slice(0, 7),
      dateLists.isoDateList[currIndex+30]?.slice(0, 7)
    ]
  });

  const {
    isBackgroundLoading
  } = useBackgroundLoadData({
    currentGeography: currDataset.geography,
    tables,
    shouldFetch: canLoadInBackground,
    currTimespans,
    dateLists,
    numeratorParams,
    denominatorParams,
    adjacentMonths: [
      dateLists.isoDateList[currIndex-30]?.slice(0, 7),
      dateLists.isoDateList[currIndex+30]?.slice(0, 7)
    ]
  });
  
  return {
    geojsonData,
    numeratorData,
    denominatorData,
    dateIndices,
    dataReady: !!numeratorDataReady && !!denominatorDataReady && !!geojsonDataReady,
    currIndex,
    isBackgroundLoading
  };
}
