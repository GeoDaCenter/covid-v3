import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { findAllDefaults, findIn, generateReport } from '../utils';
import { paramsSelectors } from '../stores/paramsStore';
import { dataSelectors } from '../stores/dataStore'
const { selectStoredDatasetsDictionary, selectGeojsonData } = dataSelectors;
const {selectCurrentData, selectDates, selectDataParams, selectDatasets, selectTables} = paramsSelectors;

export default function useGetSidebarData({
    selectionKeys=[],
    panelOpen=false
}){
    // pieces of redux state
    const currentData = useSelector(selectCurrentData);
    const dates = useSelector(selectDates);
    const dataParams = useSelector(selectDataParams);
    const datasets = useSelector(selectDatasets);
    const tables = useSelector(selectTables);

    // current state data params
    const currIndex = dataParams.nIndex||dataParams.dIndex;
    const currDataset = findIn(datasets, 'file', currentData)
    const currTables = [
        ...Object.values(currDataset.tables).map(tableId => findIn(tables, 'id', tableId)),
        ...findAllDefaults(tables, currDataset.geography).map(dataspec => ({...dataspec}))
    ].filter((entry, index, self) => self.findIndex(f => f.table === entry.table) === index)
    const geojsonData = useSelector(selectGeojsonData(currentData));
    const storedData = useSelector(selectStoredDatasetsDictionary(currTables.map(table => table.name)));
    
    const sidebarData = useMemo(() => {
        if (!panelOpen || !selectionKeys.length) 
        return {};
        return generateReport({
            currDataset,
            currIndex,
            dates,
            currTables,
            selectionKeys,
            storedData,
            properties: geojsonData?.properties,
        })
    })   

    return sidebarData
}