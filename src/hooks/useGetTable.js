import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wrap } from "comlink";
import { dataSelectors, dataActions } from '../stores/dataStore'
const { selectStoredDatasets } = dataSelectors;
const { reconcileTable } = dataActions;

const FetcherWorker =  wrap(new Worker(new URL('../workers/fetcher', import.meta.url)));

/**
 * Hook to fetch data from a remote source, or return it from the local data store, if it exists.
 * 
 * @category Hooks
 * @param {Object} props
 * @param {FileInfo[]} props.filesToFetch List of files to fetch
 * @param {boolean} props.shouldFetch Flag to indicate if should fetch data 
 * @returns {Array} Positional data of [returnData: Dataset, dataReady: boolean, error: boolean | string]. For more on Dataset, see {@link /src/stores/dataStore/types.ts}
 */
function useGetTable({
  filesToFetch = [],
  shouldFetch = false,
  dateLists = {},
}) {
  const dispatch = useDispatch();  
  const fileSchemaNames = filesToFetch.map((fileSchema) => fileSchema.name)
  const accessedData = useSelector(selectStoredDatasets(fileSchemaNames))
  console.log('accessedData', accessedData, filesToFetch)
  
  useEffect(() => {    
    if (shouldFetch) {
      if (filesToFetch[0] && !filesToFetch[0].noFile) {
        const cleanedFilesToFetch = filesToFetch.filter((fileSchema, idx) => {
          const fileExists = !!accessedData[idx];
          const fileExistsAndIsLoaded =
            fileExists &&
            !!accessedData[idx]?.loaded?.includes(fileSchema?.timespan);
          return !fileExists || !fileExistsAndIsLoaded;
        });
        const getData = async () => FetcherWorker.fetch(cleanedFilesToFetch, dateLists)
        getData()
          .then((dataArray) => {
            if (dataArray.length) {
              dataArray.forEach(({ value: newData }, idx) => {
                dispatch(reconcileTable({
                    name: cleanedFilesToFetch[idx].name,
                    newData,
                    timespan: cleanedFilesToFetch[idx].timespan,
                  }))
              });
            }
          })
          .catch((e) => console.log("error fetching table!", e, cleanedFilesToFetch));
      }
    }
  }, [shouldFetch, JSON.stringify(filesToFetch)]);

  const { dataReady, returnData, error } = useMemo(() => {
    const dataReady =
      filesToFetch.length &&
      filesToFetch.every(({ name, timespan }, idx) => {
        const missingParams = !name || !timespan;
        const temporalDataLoaded = accessedData[idx] && accessedData[idx]?.loaded?.includes(timespan) 
        const xSectionDataLoaded = accessedData[idx] && accessedData[idx]?.columns?.length > 0;
        const fileIsNull = filesToFetch.every(({noFile}) => noFile);
        return temporalDataLoaded || xSectionDataLoaded || fileIsNull || missingParams;
      });
    const returnData = dataReady ? accessedData[0] : undefined;
    const error = false;
    return {
      returnData,
      dataReady,
      error,
    };
  }, [JSON.stringify(accessedData[0]?.loaded), JSON.stringify(filesToFetch)]);
  
  return [returnData, dataReady, error]; //currentLoadedTables
}

export default useGetTable;