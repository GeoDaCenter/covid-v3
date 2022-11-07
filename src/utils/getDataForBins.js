import dataFn from './dataFunction';
/**
 * Function to get data for bins or choropleth.
 * 
 * @category Utils/Data
 * @param  {Object} numeratorData An object of data keyed to the current GEOID / numeric identifier for the numerator table
 * @param  {Object} denominatorData An object of data keyed to the current GEOID / numeric identifier for the denominator table
 * @param {Object} dataParams - Parameters for the data function, see
 *   VariableSpec {@link src/stores/paramsStore/types.ts}
 * @param  {Boolean} fixedOrder If true, follows the fixed order to align with jsgeoda's expected input
 * @param  {Boolean} dataReady Flag to confirm if data is fully available
 * @param  {Number} binIndex Date index to use for timeseries data, if applicable
 */
const getDataForBins = ({
  numeratorData,
  denominatorData = {},
  dataParams,
  fixedOrder = false,
  dataReady = true,
  binIndex = null,
}) => {
  // Return early if data is not ready
  if (!dataReady || !numeratorData || !dataParams?.numerator) return [];
  
  // Destructure only what is necessary
  const { nProperty, dType, dProperty } = dataParams;
  
  // length of data table to loop through
  const keys = fixedOrder || Object.keys(numeratorData);
  const n = keys.length;
  
  // If manual binIndex, use that, otherwise default to dataParams
  const nIndex = (binIndex || dataParams.nIndex) === null && nProperty === null
    ? numeratorData[keys[0]].length - 1
    : binIndex || dataParams.nIndex

  // Update dIndex if time-series over time-series data
  const dIndex = dType === 'time-series' ? nIndex : null;
  if ((!!dIndex || !!dProperty) && !denominatorData) return [];

  // declare empty array for return variables
  let rtn = new Array(fixedOrder ? fixedOrder.length : numeratorData.length);


  // The old ways are the fastest ways, it seems
  for (let i = 0; i < n; i++) {
    rtn[i] =
      dataFn(
        numeratorData[keys[i]], 
        denominatorData[keys[i]], 
        {...dataParams, nIndex, dIndex},
      );
  }

  // 
  let conditionalCheck = () => false;
  if (dataParams.numerator.indexOf('vaccin') !== -1) {
    conditionalCheck = (val) => (val > 100 ? true : false);
    for (let i = 0; i < rtn.length; i++) {
      if (conditionalCheck(rtn[i])) rtn[i] = 100;
    }
  } 
  
  return rtn;
};
export default getDataForBins;
