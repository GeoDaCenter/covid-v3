import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  findAllDefaults,
} from '../utils';
import { wrap } from "comlink";
import { dataActions } from '../stores/dataStore';
const { reconcileTables } = dataActions;
const FetcherWorker =  wrap(new Worker(new URL('../workers/fetcher', import.meta.url)));

export default function useBackgroundLoadData({
  currentGeography = '',
  shouldFetch = false,
  tables = [],
  currTimespans = ['latest'],
  dateLists = {},
  numeratorParams = {},
  denominatorParams = {},
  adjacentMonths = [],
}) {
  const dispatch = useDispatch();
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)

  useEffect(() => {
    const adjacentMainToFetch = adjacentMonths.map(timespan => [
      { ...numeratorParams[0], timespan },
      { ...denominatorParams[0], timespan },
    ]).flat()

    const tablesToFetch = currTimespans.map(timespan =>
      findAllDefaults(tables, currentGeography)
        .map(dataspec => ({ ...dataspec, timespan }))).flat()

    const filesToFetch = [...adjacentMainToFetch, ...tablesToFetch]
      .flat().filter(f => !f.noFile && f.timespan !== false && f.timespan !== undefined);

    if (shouldFetch && filesToFetch.length) {
      const getData = async () => FetcherWorker.fetchAndClean(filesToFetch, dateLists)
      setIsBackgroundLoading(true)
      getData().then(data => {
        dispatch(reconcileTables(data))
        setIsBackgroundLoading(false)
      })
    }
  }, [shouldFetch]);

  return {
    isBackgroundLoading
  }
};
