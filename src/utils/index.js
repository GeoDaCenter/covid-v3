import addSelectedChartData from "./addSelectedChartData";
import colIndex from "./colIndex.js";
import colLookup from "./colLookup.js";
import dataFn from "./dataFunction.js";
import debounce from "./debounce.js";
import {
  findAllCurrentTables,
  findAllDefaults,
  findIn,
  findDefault,
  findDefaultOrCurrent,
  findDates,
  findDateIndices,
  getDateIndices,
  findTableOrDefault,
} from "./find";
import {
  findCounty
} from "./findCounty.js";
import { findClosestValue, findDateIncrement, findDateDecrement } from "./findClosestValue";
import { findNextIndex, findPreviousIndex } from "./findNextIndex";
import { findSecondaryMonth } from './findSecondaryMonth'
import formatNumber from "./formatNumber";
import { generateReport } from "./generateReport";
import getCSV from "./getCSV.js";
import getDataForBins from "./getDataForBins.js";
import { getDateLists } from "./getDateLists.js";
import { getFetchParams } from "./getFetchParams";
import getGeoidIndex from "./getGeoidIndex";
import { getIdOrder } from "./getIdOrder";
import { getClosestIndex, getLastIndex } from "./getDateIndices";
import getLisaValues from "./getLisaValues";
import { getParseCsvPromise, getParseCSV } from "./getParseCSV";
import getParsePbf, { parsePbfData } from "./getParsePbf";
import getURLParams from "./getURLParams";
import getVarId from "./getVarId";
import { hasProps } from "./hasProps";
import { indexGeoProps } from "./indexGeoProps";
import { mapFn, mapFnNb, mapFnTesting, mapFnHinge } from "./mapFunction.js";
import {
  matchVarRequests,
  replaceInlineVars,
  matchAndReplaceInlineVars,
} from './matchAndReplaceInlineVars';
import { onlyUniqueArray } from './onlyUniqueArray';
import parseMapboxLayers from "./parseMapboxLayers";
import { parseTooltipData } from "./parseTooltipData";
import resolveName from "./resolveName";
import shallowCompare from "./shallowCompare";
import { stitch } from "./stitch";

// archived 
// import { generateMapData } from './generateMapData';
// import geojsonArrayBuffer from "./_geojsonArrayBuffer";
// import getArrayCSV from "./_getArrayCSV";
// import getCartogramValues from "./_getCartogramValues";
// import getCartogramCenter from "./_getCartogramCenter";
// import getColumns from "./archive/getCols";
// import getCurrentWuuid from './getCurrentWuuid.js';
// import getDataForCharts from "./archive/getDataForCharts.js";
// import getDataForLisa from "./archive/getDataForLisa.js";
// import getGeoids from "./archive/getGeoids";
// import getGzipData from "./archive/getGzipData";
// import getJson from "./archive/getJson";
// import getJsonPure from "./archive/getJsonPure";
// import loadGeojsonToGeoda from "./archive/loadGeojsonToGeoda";
// import loadJson from "./archive/loadJson";
// import parseBinPairs from "./archive/parseBinPairs";
// import { removeListItem } from "./archive/removeListItem";
// import { shallowEqual } from "./archive/shallowEqual";

export {
  addSelectedChartData,
  colIndex,
  colLookup,
  dataFn,
  debounce,
  findAllCurrentTables,
  findAllDefaults,
  findCounty,
  findIn,
  findDates,
  findDateIndices,
  findDefault,
  findDefaultOrCurrent,
  findTableOrDefault,
  findClosestValue,
  findDateIncrement,
  findDateDecrement,
  findNextIndex,
  findPreviousIndex,
  findSecondaryMonth,
  formatNumber,
  getDateIndices,
  // geojsonArrayBuffer,
  // generateMapData,
  generateReport,
  // getArrayCSV,
  // getCartogramValues,
  // getCartogramCenter,
  // getColumns,
  // getCurrentWuuid,
  getCSV,
  getDataForBins,
  // getDataForCharts,
  // getDataForLisa,
  getDateLists,
  getFetchParams,
  getGeoidIndex,
  // getGeoids,
  getIdOrder,
  // getJson,
  // getJsonPure,
  getClosestIndex,
  getLastIndex,
  getLisaValues,
  getParseCSV,
  getParseCsvPromise,
  getParsePbf,
  getURLParams,
  getVarId,
  // getGzipData,
  hasProps,
  indexGeoProps,
  // loadGeojsonToGeoda,
  // loadJson,
  mapFn,
  mapFnNb,
  mapFnTesting,
  mapFnHinge,
  matchVarRequests,
  replaceInlineVars,
  matchAndReplaceInlineVars,
  onlyUniqueArray,
  // parseBinPairs,
  parseMapboxLayers,
  parsePbfData,
  parseTooltipData,
  // removeListItem,
  resolveName,
  shallowCompare,
  // shallowEqual,
  stitch
};
