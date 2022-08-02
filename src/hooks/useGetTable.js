import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wrap } from "comlink";
const FetcherWorker =  wrap(new Worker(new URL('../workers/fetcher', import.meta.url)));

export default function useGetTable({
  filesToFetch = [],
  shouldFetch = false,
  dateLists = {},
}) {
  const dispatch = useDispatch();  
  const storedData = useSelector(({data}) => data.storedData);
  const accessedData = filesToFetch.map((fileSchema) => storedData[fileSchema.name])
  
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
                dispatch({
                  type: "RECONCILE_TABLE",
                  payload: {
                    name: cleanedFilesToFetch[idx].name,
                    newData,
                    timespan: cleanedFilesToFetch[idx].timespan,
                  },
                });
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
