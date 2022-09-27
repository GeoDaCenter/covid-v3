import { useState, useEffect } from 'react';
import { useGeoda } from '../contexts/Geoda';
import { useDispatch, useSelector } from 'react-redux';
import { dataSelectors } from '../stores/dataStore'
const { selectStoredGeojson } = dataSelectors;

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
    const storedGeojson = useSelector(selectStoredGeojson);
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
