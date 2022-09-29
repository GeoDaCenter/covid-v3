import {useMemo} from 'react';
import { useSelector } from 'react-redux';
import { findIn, findAllDefaults, parseTooltipData } from '../utils';
import { paramsSelectors } from '../stores/paramsStore';
import { dataSelectors } from '../stores/dataStore'
const { selectGeojsonData, selectStoredDatasetsDictionary } = dataSelectors;
const { selectCurrentData, selectDataParams, selectDatasets, selectTables } = paramsSelectors;
export default function useGetTooltipContent({
    data=false,
    geoid=null
}){
    // pieces of redux state
    const currentData = useSelector(selectCurrentData);
    const dataParams = useSelector(selectDataParams);
    const datasets = useSelector(selectDatasets);
    const tables = useSelector(selectTables);

    // current state data params
    const currIndex = dataParams.nIndex||dataParams.dIndex;
    const currDataset = findIn(datasets, 'file', currentData)
    const {
        currTables,
        currTableNames
    } = useMemo(() => {
        const currTables = [
            ...Object.values(currDataset.tables).map(tableId => findIn(tables, 'id', tableId)),
            ...findAllDefaults(tables, currDataset.geography).map(dataspec => ({...dataspec}))
        ].filter((entry, index, self) => self.findIndex(f => f.table === entry.table) === index)
        const currTableNames = currTables.map(table => table.name);
        return {
            currTables,
            currTableNames
        }
    },
    [JSON.stringify({currDataset, tables})]);
    
    const geojsonData = useSelector(selectGeojsonData(currentData));
    const storedData = useSelector(selectStoredDatasetsDictionary(currTableNames));

    const tooltipContent = useMemo(() => {
        const tooltipData = parseTooltipData({
            currDataset,
            currIndex,
            currTables,
            geoid,
            properties: geojsonData?.properties,
            storedData
        })

        return {
            ...tooltipData,
            ...data
        }
    },[JSON.stringify(data), geoid, currIndex, currentData])
    
    if (currentData.includes('customdata')){
        return {
            ...tooltipContent,
            custom: true
        }
    }

    return tooltipContent

}