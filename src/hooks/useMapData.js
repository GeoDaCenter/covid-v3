import { useMemo, useState } from "react";
import useLoadData from "./useLoadData";
import useGetBins from "./useGetBins";
import useLisaMap from './useLisaMap';
import useCartogramMap from './useCartogramMap';
import { useGeoda } from "../contexts/Geoda";
import { getVarId, getDataForBins } from "../utils";
import { colorScales } from "../config/scales";

const maxDesirableHeight = 500_000;

const getContinuousColor = (val, breaks, colors, useZero = false) => {
  if (useZero && val === 0) return [240, 240, 240];
  if (val === null || val === undefined) return [50, 50, 50];
  for (let i = 0; i < breaks.length; i++) {
    if (val <= breaks[i]) return colors[i];
  }
  return colors[colors.length - 1];
};

const generateJoinData = ({
  binData,
  bins,
  lisaData,
  mapParams,
  order,
  dataReady,
  shouldSeparateZero=false
}) => {
  if (!dataReady || (mapParams.mapType !== 'lisa' && !bins.breaks) || (mapParams.mapType === 'lisa' && !lisaData.length)) return [{}, undefined];
  const geoids = Object.values(order);
  let joinData = {};
  if (mapParams.mapType === "lisa") {
    for (let i = 0; i < geoids.length; i++) {
      joinData[geoids[i]] = {
        color: colorScales.lisa[lisaData[i]],
        value: binData[i],
      };
    }
  } else {
    for (let i = 0; i < geoids.length; i++) {
      joinData[geoids[i]] = {
        color: getContinuousColor(
          binData[i],
          bins.breaks,
          mapParams.colorScale,
          shouldSeparateZero
        ),
        value: binData[i],
      };
    }
  }
  return [joinData, maxDesirableHeight / Math.max(...binData)];
};


/**
 * @param  {Object} {dataParams Paramters for data handling, including numerator and denominator tables, column or index accessors
 * @param  {String} currentData The name of the current Geojson file loaded on the map
 * @param  {Object} mapParams} Map Params for map modes, bin types, etc.
 */
export default function useMapData({
  dataParams,
  currentData,
  mapParams
}) {
  const { geoda } = useGeoda();
  const [mapSnapshot, setMapSnapshot] = useState(0);
  // Based on the data params and current geojson, useLoadData does the heavy lifting on
  // bringing us the majority of what we need. dataReady will be the trigger for much of the rest of this hook
  const {
    geojsonData,
    numeratorData,
    denominatorData,
    dateIndices,
    dataReady,
    currIndex,
    isBackgroundLoading
  } = useLoadData({
    dataParams,
    currentData
  });

  /**
   * currIndex is the reconcile index in case of null index, which defaults to most recent
   *  or an index outside of the current data range when changing datasets. 
   */
  const combinedParams = {
    ...dataParams,
    nIndex: dataParams?.nType && dataParams.nType.includes("time") ? currIndex : dataParams.nIndex,
    dIndex: dataParams?.dType && dataParams.dType.includes("time") ? currIndex : dataParams.dIndex,
  }
  // hashed params  
  const varId = getVarId(currentData, combinedParams, mapParams, dataReady);

  const binIndex =
    !!dateIndices
      ? mapParams.binMode === "dynamic" &&
        dateIndices?.indexOf(combinedParams.nIndex) !== -1
        ? combinedParams.nIndex
        : dateIndices.slice(-1)[0]
      : null;

  // used to generate bins
  const binData = useMemo(
    () => {
      return getDataForBins({
        numeratorData:
          combinedParams.numerator === "properties"
            ? geojsonData?.properties
            : numeratorData?.data,
        denominatorData:
          combinedParams.denominator === "properties"
            ? geojsonData?.properties
            : denominatorData?.data,
        dataParams: combinedParams,
        binIndex,
        fixedOrder:
          geojsonData?.order?.indexOrder &&
          Object.values(geojsonData.order.indexOrder),
        dataReady,
      })
    },
    [JSON.stringify({ ...combinedParams, nIndex: 0, dIndex: 0 }), JSON.stringify(mapParams), binIndex, dataReady, currentData]
  );
  // console.table(combinedParams)
  // console.log(binData)

  // different than binData in that this can be a different date index
  // Meaning, bin on the most recent, then draw map on a different date
  const mapData = useMemo(
    () => binIndex === combinedParams.nIndex || combinedParams.nIndex === null
      ? binData
      : getDataForBins({
        numeratorData:
          combinedParams.numerator === "properties"
            ? geojsonData?.properties
            : numeratorData?.data,
        denominatorData:
          combinedParams.denominator === "properties"
            ? geojsonData?.properties
            : denominatorData?.data,
        dataParams: combinedParams,
        binIndex: false,
        fixedOrder:
          geojsonData?.order?.indexOrder &&
          Object.values(geojsonData.order.indexOrder),
        dataReady,
      }),
    [JSON.stringify(combinedParams), JSON.stringify(mapParams), dataReady, currentData]
  );

  const bins = useGetBins({
    currentData,
    mapParams,
    dataParams: combinedParams,
    binData,
    geoda,
    dataReady,
    // shouldSeparateZero: dataParams.separateZero // enabling this bins only non-zero values
  });

  const [
    lisaData,
    lisaVarId
  ] = useLisaMap({
    currentData,
    dataForLisa: mapData,
    mapId: geojsonData?.mapId,
    shouldUseLisa: dataReady && mapParams.mapType === "lisa",
    varId,
    dataReady
  });

  const {
    cartogramData,
    cartogramCenter,
    cartogramDataSnapshot
  } = useCartogramMap({
    mapId: geojsonData?.mapId,
    dataForCartogram: mapData,
    shouldUseCartogram: dataReady && mapParams.vizType === "cartogram",
    dataReady,
    varId,
    order: geojsonData?.order?.indexOrder,
    geojsonData: geojsonData?.data
  });
  
  const [colorAndValueData, heightScale] = useMemo(() => {
    const data = generateJoinData({
      binData: mapData,
      bins,
      lisaData,
      cartogramData,
      mapParams,
      dataParams: combinedParams,
      order: geojsonData?.order?.indexOrder,
      dataReady,
      shouldSeparateZero: dataParams.separateZero 
    });
    !!data && setMapSnapshot(`${new Date().getTime()}`.slice(-6));
    return data;
  }, [
    mapParams.binMode !== 'dynamic' && mapParams.mapType === 'natural_breaks' && combinedParams.nIndex,
    dataReady,
    // JSON.stringify(dataParams),
    JSON.stringify(bins),
    mapParams.mapType === 'lisa' && lisaVarId,
    currentData
    // JSON.stringify(cartogramData),
  ]);

  const sanitizedHeightScale = !isNaN(heightScale) && heightScale !== Infinity ? heightScale : 1;

  return [
    geojsonData?.data, // geography
    colorAndValueData, // color and value data
    { cartogramData, cartogramCenter, cartogramDataSnapshot }, // cartogram data
    mapSnapshot, // string params for updater dep arrays
    bins, // bins for legend etc,
    sanitizedHeightScale, // height scale
    !(dataReady && (bins?.breaks || lisaData) && Object.keys(colorAndValueData).length),
    geojsonData,
    currIndex,
    isBackgroundLoading
  ];
}