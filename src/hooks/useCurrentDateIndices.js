import { useSelector } from 'react-redux';
import dataDateRanges from "../config/dataDateRanges";
import { paramsSelectors } from "../stores/paramsStore";
import { dataSelectors } from '../stores/dataStore'
const { selectStoredDataset } = dataSelectors;
const { selectPartialDataParam, selectCurrentTable, selectDates } = paramsSelectors;

export default function useCurrentDateIndices() {
    const nIndex = useSelector(selectPartialDataParam('nIndex'));
    const dIndex = useSelector(selectPartialDataParam('dIndex'));
    const nRange = useSelector(selectPartialDataParam('nRange'));
    const dRange = useSelector(selectPartialDataParam('dRange'));
    const rangeType = useSelector(selectPartialDataParam('rangeType'))
    const dates = useSelector(selectDates);
    const currentTable = useSelector(selectCurrentTable);
    const currentNumeratorName = currentTable?.numerator?.name?.split('.')[0]

    const dataset = useSelector(selectStoredDataset(currentNumeratorName));
    const currDates = dataset?.dates
    
    const currDatesAvailable = dataDateRanges[currentTable?.numerator?.name?.split('.')[0]];
    const currentIndex = (nIndex||dIndex) === null 
        ? currDatesAvailable?.slice(-1)[0] || dates.length-1
        : (nIndex||dIndex)
    const currRange = nRange||dRange; 
    return [
        currentIndex||1,
        currDates||[],
        currDatesAvailable||[],
        dates||[],
        currRange,
        rangeType
    ]
}