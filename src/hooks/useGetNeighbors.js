import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGeoda } from '../contexts/Geoda'
import useGetGeojson from './useGetGeojson'
import { findIn, onlyUniqueArray } from '../utils'
import { paramsSelectors } from '../stores/paramsStore'
import { dataActions } from '../stores/dataStore'
const { selectDatasets } = paramsSelectors
const { addWeights } = dataActions

const getWeights = async (weights, mapId, geoda) => {
    if (weights && 'Queen' in weights) {
        return {
            weights: weights.Queen,
            shouldCacheWeights: false,
        }
    } else {
        const weights = await geoda.getQueenWeights(mapId)
        return {
            weights,
            shouldCacheWeights: true,
        }
    }
}

const getNeighbors = async (weights, geoda, idx) => {
    const neighbors = await geoda.getNeighbors(weights, idx)
    const secondOrderNeighborsResult = await Promise.all(
        neighbors.map((f) => geoda.getNeighbors(weights, f))
    )
    const secondOrderNeighbors = secondOrderNeighborsResult
        .flat()
        .filter(onlyUniqueArray)
    return {
        neighbors,
        secondOrderNeighbors,
    }
}

/**
 * Jsgeoda helper hook to get neighbors and second order neighbors of a given
 * geometry
 *
 * @category Hooks
 * @param {Object} props
 * @param {id} props.geoid Id of the geometry
 * @param {string} props.currentData Name of the current dataset
 * @param {any} props.updateTrigger Manual trigger to update the hook
 * @returns IDs of all neighbors, second order neighbors, and state-level
 *   neighbors [neighbors: number[], secondOrderNeighbors: number[],
 *   stateNeighbors: number[]]
 */
function useGetNeighbors({ geoid = null, currentData, updateTrigger = null }) {
    const dispatch = useDispatch()
    const { geoda, geodaReady } = useGeoda()
    const datasets = useSelector(selectDatasets)
    const currDataset = findIn(datasets, 'file', currentData)
    const [geojsonData] = useGetGeojson({
        geoda,
        geodaReady,
        currDataset,
    })
    const { geoidOrder, indexOrder } = geojsonData?.order || {}

    const { weights, mapId } = geojsonData || {}

    const [neighbors, setNeighbors] = useState({
        neighbors: [],
        secondOrderNeighbors: [],
        state: [],
    })

    useEffect(() => {
        if (geoidOrder && geoid) {
            const index = geoidOrder[geoid]
            getWeights(weights, mapId, geoda).then(
                ({ weights, shouldCacheWeights }) => {
                    getNeighbors(weights, geoda, index).then(
                        ({ neighbors, secondOrderNeighbors }) => {
                            setNeighbors({
                                neighbors: neighbors.map((n) => indexOrder[n]),
                                secondOrderNeighbors: secondOrderNeighbors.map(
                                    (n) => indexOrder[n]
                                ),
                                state: Object.entries(geoidOrder)
                                    .filter(
                                        ([k]) =>
                                            Math.floor(k / 1000) ===
                                            Math.floor(geoid / 1000)
                                    )
                                    .map(([_, v]) => indexOrder[v]),
                            })
                        }
                    )
                    if (shouldCacheWeights) {
                        dispatch(
                            addWeights({
                                id: currentData,
                                weights,
                            })
                        )
                    }
                }
            )
        }
    }, [geoid, currentData, geodaReady, updateTrigger])

    return [
        neighbors.neighbors,
        neighbors.secondOrderNeighbors,
        neighbors.state,
    ]
}

export default useGetNeighbors
