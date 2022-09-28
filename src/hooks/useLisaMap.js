import { useState, useEffect } from 'react';
import { useGeoda } from '../contexts/Geoda';
import { useDispatch, useSelector } from 'react-redux';
import { dataSelectors, dataActions } from '../stores/dataStore'
const { selectGeojsonData } = dataSelectors;
const { addWeights } = dataActions;

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

export default function useLisaMap({
    currentData,
    dataForLisa = [],
    shouldUseLisa = false,
    varId,
    dataReady
}) {
    const { geoda, geodaReady } = useGeoda();
    const dispatch = useDispatch();
    const geojsonData = useSelector(selectGeojsonData(currentData));

    const [data, setData] = useState({
        lisaData: [],
        lisaVarId: '',
    });
    useEffect(() => {
        if (
            shouldUseLisa &&
            geodaReady &&
            dataForLisa.length &&
            geojsonData?.weights &&
            dataReady
        ) {
            getLisa(geojsonData, geoda, dataForLisa).then(
                ({ lisaValues, shouldCacheWeights, weights }) => {
                    setData({
                        lisaData: lisaValues.clusters,
                        lisaVarId: varId,
                    });
                    if (shouldCacheWeights) {
                        dispatch(addWeights({
                            id: currentData,
                            weights,
                        }))
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
