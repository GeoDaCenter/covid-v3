import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { findAllDefaults, findIn, generateReport } from '../utils';
import { paramsSelectors } from '../stores/paramsStore';
import { dataSelectors } from '../stores/dataStore'
const { selectStoredDatasetsDictionary, selectGeojsonData } = dataSelectors;
const {selectCurrentData, selectDates, selectDataParams, selectDatasets, selectTables} = paramsSelectors;

/**
 * Hook to generate report data. Return data is an object with numerous summary data points. Features are currently hard coded in {@link /src/utils/generateReport.js}
 * 
 * @category Hooks
 * @param {Object} props
 * @param {Array} props.selectionKeys - List of GEOIDs to generate report for
 * @param {boolean} props.panelOpen - Flag for if the panel is open, and if should generate report 
 * @returns {Object} See {@link /src/utils/generateReport.js}
 */
function useGetSidebarData({
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

export default useGetSidebarData