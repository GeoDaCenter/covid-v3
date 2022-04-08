import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLoadData from "./useLoadData";
import { useGeoda } from "../contexts/Geoda";
import { getVarId, getDataForBins } from "../utils";
import { fixedScales } from "../config/scales";
import { colorScales } from "../config/scales";
// function getAndCacheWeights
// function getAndCacheCentroids
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
  // cartogramData,
  mapParams,
  // dataParams,
  order,
  dataReady,
  // storedGeojson,
}) => {
  if (!dataReady || (mapParams.mapType !== 'lisa' && !bins.breaks) || (mapParams.mapType === 'lisa' && !lisaData.length)) return [{}, undefined];
  const geoids = Object.values(order);

  // const getColor = getColorFunction(mapParams.mapType)
  // const mapFn = getMapFunction(mapParams.mapType, dataParams.numerator)
  // const getHeight = dataParams.variableName.toLowerCase().includes("percent")
  //     ? getPctHeight
  //     : getStandardHeight
  let joinData = {};
  if (mapParams.mapType === "lisa") {
    for (let i = 0; i < geoids.length; i++) {
      joinData[geoids[i]] = {
        color: colorScales.lisa[lisaData[i]],
        value: binData[i],
      };
    }
  } else {
    const shouldUseZero = JSON.stringify(mapParams.colorScale[0]) === JSON.stringify([240, 240, 240])
    for (let i = 0; i < geoids.length; i++) {
      joinData[geoids[i]] = {
        color: getContinuousColor(
          binData[i],
          bins.breaks,
          mapParams.colorScale,
          shouldUseZero
        ),
        value: binData[i],
      };
    }
  }
  return [joinData, maxDesirableHeight / Math.max(...binData)];
};

const getLisa = async (currentGeojson, geoda, dataForLisa) => {
  const weights =
    currentGeojson && "Queen" in currentGeojson.weights
      ? currentGeojson.weights.Queen
      : await geoda.getQueenWeights(currentGeojson.mapId);
  const lisaValues = await geoda.localMoran(weights, dataForLisa);

  return {
    lisaValues,
    shouldCacheWeights: !("Queen" in currentGeojson.weights),
    weights,
  };
};

export function useLisaMap({
  currentData,
  dataForLisa = [],
  shouldUseLisa = false,
  varId,
  dataReady
}) {
  const { geoda, geodaReady } = useGeoda();
  const dispatch = useDispatch();
  const storedGeojson = useSelector(({ data }) => data.storedGeojson);
  const [data, setData] = useState({
    lisaData: [],
    lisaVarId: '',
  });
  useEffect(() => {
    if (
      shouldUseLisa &&
      geodaReady &&
      dataForLisa.length &&
      storedGeojson[currentData] &&
      dataReady
    ) {
      getLisa(storedGeojson[currentData], geoda, dataForLisa).then(
        ({ lisaValues, shouldCacheWeights, weights }) => {
          setData({
            lisaData: lisaValues.clusters,
            lisaVarId: varId,
          });
          if (shouldCacheWeights) {
            dispatch({
              type: "ADD_WEIGHTS",
              payload: {
                id: currentData,
                weights,
              },
            });
          }
        }
      );
    } else {
      return null;
    }
  }, [geodaReady, currentData, shouldUseLisa, varId, dataReady]);
  return [
    data.lisaData,
    data.lisaVarId
  ]
}

export function useCartogramMap({
  mapId = "",
  dataForCartogram,
  shouldUseCartogram = false,
  dataReady,
  varId,
  order,
  geojsonData
}) {
  const { geoda, geodaReady } = useGeoda();
  const [cartogramData, setCartogramData] = useState({
    cartogramData: [],
    cartogramCenter: [0,0],
    cartogramDataSnapshot: ''
  });
  const [geodaTimeout, setGeodaTimeout] = useState(null);
  const debounceDelay = dataForCartogram && dataForCartogram.length < 500 ? 0 : 250;

  useEffect(() => {
    clearTimeout(geodaTimeout);
    if (
      shouldUseCartogram &&
      geodaReady &&
      dataForCartogram.length &&
      mapId.length
    ) {
      const getCartogramData = async () => {
        let cartogramValues = await geoda
          .cartogram(mapId, dataForCartogram)
          .then((data) => {
            const cartogramData = [];
            let cartogramCenter = [0, 0];
            for (let i = 0; i < data.length; i++) {
              cartogramData.push({
                ...data[i],
                value: dataForCartogram[i],
                id: order[data[i].properties.id],
                properties: {
                  ...geojsonData.features[i].properties
                }
              })
              cartogramCenter[0] += data[i].position[0];
              cartogramCenter[1] += data[i].position[1];
            }
            cartogramCenter[0] /= data.length;
            cartogramCenter[1] /= data.length;
            
            return {
              cartogramData,
              cartogramCenter,
              cartogramDataSnapshot: varId
            }
          })      
        setCartogramData(cartogramValues);
      }
      setGeodaTimeout(setTimeout(getCartogramData, debounceDelay));
    }
  },[
    dataReady,
    varId,
    shouldUseCartogram,
    mapId,
    geodaReady
  ])
  return cartogramData;
}

const getAsyncBins = async (geoda, mapParams, binData) =>
  mapParams.mapType === "natural_breaks"
    ? await geoda.quantileBreaks(mapParams.nBins, binData)
    : await geoda.hinge15Breaks(binData);

function useGetBins({
  currentData,
  mapParams,
  dataParams,
  binData,
  geoda,
  dataReady,
}) {
  const [bins, setBins] = useState({});
  const [binnedParams, setBinnedParams] = useState({
    mapParams: JSON.stringify(mapParams),
    dataParams: JSON.stringify(dataParams),
    dataReady,
    geoda: typeof geoda,
    currentData: null,
  });

  useEffect(() => {
    if (!dataReady) return;

    // if you already have bins....
    if (bins.bins && binnedParams.currentData === currentData) {
      if (
        binnedParams.mapParams === JSON.stringify(mapParams) &&
        binnedParams.dataReady === dataReady &&
        binnedParams.geoda === typeof geoda &&
        typeof geoda === "function" &&
        binnedParams.dataParams === JSON.stringify(dataParams)
      ) {
        console.log("same params");
        return;
      }

      if (
        mapParams.binMode !== "dynamic" &&
        JSON.stringify({
          ...JSON.parse(binnedParams.mapParams),
          ...JSON.parse(binnedParams.dataParams),
          dIndex: 0,
          nIndex: 0,
        }) ===
        JSON.stringify({ ...mapParams, ...dataParams, dIndex: 0, nIndex: 0 })
      ) {
        // console.log("diff params, not dynamic");
        return;
      }
    }
    if (mapParams.mapType === "lisa") {
      setBins(fixedScales["lisa"]);
      setBinnedParams({
        mapParams: JSON.stringify(mapParams),
        dataParams: JSON.stringify(dataParams),
        dataReady,
        geoda: typeof geoda,
        currentData,
      });
    } else if (
      dataParams.fixedScale !== null &&
      dataParams.fixedScale !== undefined &&
      fixedScales[dataParams.fixedScale]
    ) {
      setBins(fixedScales[dataParams.fixedScale]);
      setBinnedParams({
        mapParams: JSON.stringify(mapParams),
        dataParams: JSON.stringify(dataParams),
        dataReady,
        geoda: typeof geoda,
        currentData,
      });
    } else if (typeof geoda === "function") {
      // console.log("generating bins");
      getAsyncBins(geoda, mapParams, binData).then((nb) => {
        setBins({
          bins:
            mapParams.mapType === "natural_breaks"
              ? nb
              : [
                "Lower Outlier",
                "< 25%",
                "25-50%",
                "50-75%",
                ">75%",
                "Upper Outlier",
              ],
          breaks: nb,
        });
        setBinnedParams({
          mapParams: JSON.stringify(mapParams),
          dataParams: JSON.stringify(dataParams),
          dataReady,
          geoda: typeof geoda,
          currentData,
        });
      });
    }
    return {};
  }, [
    JSON.stringify(mapParams),
    JSON.stringify(dataParams),
    typeof geoda,
    dataReady,
    currentData
  ]); //todo update depenency array if needed for some dataparam roperties
  return bins;
}
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
