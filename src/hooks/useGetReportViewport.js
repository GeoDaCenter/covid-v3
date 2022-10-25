import { useMemo } from 'react'
import bbox from '@turf/bbox'
import { fitBounds } from '@math.gl/web-mercator'
import useGetNeighbors from './useGetNeighbors'
const DEFAULT_VIEWPORT = {
    latitude: 0,
    longitude: 0,
    zoom: 4,
    bearing: 0,
    pitch: 0,
}

/**
 * Hook to get the viewport for a given geoid, primarily used for report
 * generation
 *
 * @category Hooks
 * @param {Object} props
 * @param {string} props.geoid Geoid of the current location
 * @param {string} props.currentData Name of the current dataset
 * @param {Object} props.geojsonData GeojsonDataset - see
 *   {@link src/stores/dataStore/types.ts}
 * @param {string} props.mapIdCol Name of the column that contains the map id
 * @param {number} props.mapWidth Width of the map in pixels
 * @param {number} props.mapHeight Height of the map in pixels
 * @returns {Array} Positional data returned by the hook [ countyViewport:
 *   {latitude:number,longitude:number...}, neighborsViewport:
 *   {latitude:number,longitude:number...}, secondOrderViewport:
 *   {latitude:number,longitude:number...}, stateViewport:
 *   {latitude:number,longitude:number...}, nationalViewport:
 *   {latitude:number,longitude:number...}, neighbors: number[],
 *   secondOrderNeighbors: number[], stateNeighbors: number[] ]
 */
function useGetReportViewport({
    // viewportType = "county",
    geoid = 17031,
    margin = 0.1,
    currentData = '',
    geojsonData,
    mapIdCol,
    mapWidth,
    mapHeight,
}) {
    const [neighbors, secondOrderNeighbors, stateNeighbors] = useGetNeighbors({
        geoid,
        currentData,
    })

    const nationalViewport = useMemo(() => {
        if (!!mapWidth && !!mapHeight) {
            const bounds = fitBounds({
                width: mapWidth,
                height: mapHeight,
                bounds: [
                    [-125.109215, 25.043926],
                    [-66.925621, 49.295128],
                ],
            })
            return { ...bounds, zoom: bounds.zoom * 0.85 }
        }
        return DEFAULT_VIEWPORT
    }, [mapWidth, mapHeight])

    const [
        countyViewport,
        neighborsViewport,
        secondOrderViewport,
        stateViewport,
    ] =
        geojsonData?.data?.features?.length &&
        neighbors?.length &&
        secondOrderNeighbors?.length &&
        stateNeighbors?.length
            ? [[geoid], neighbors, secondOrderNeighbors, stateNeighbors].map(
                  (neighborList) => {
                      if (!neighborList || !neighborList?.length) return null
                      const tempBbox = bbox({
                          ...geojsonData.data,
                          features: geojsonData.data.features.filter((f) =>
                              neighborList.includes(+f.properties[mapIdCol])
                          ),
                      })
                      if (!tempBbox || !tempBbox?.length)
                          return DEFAULT_VIEWPORT
                      try {
                          const bounds = fitBounds({
                              width: mapWidth,
                              height: mapHeight,
                              bounds: [
                                  [tempBbox[0], tempBbox[1]],
                                  [tempBbox[2], tempBbox[3]],
                              ],
                          })
                          return {
                              ...bounds,
                              zoom: bounds.zoom * (1 - margin),
                              pitch: 0,
                              bearing: 0,
                          }
                      } catch {
                          return DEFAULT_VIEWPORT
                      }
                  }
              )
            : [DEFAULT_VIEWPORT, DEFAULT_VIEWPORT, DEFAULT_VIEWPORT]

    return [
        countyViewport,
        neighborsViewport,
        secondOrderViewport,
        stateViewport,
        nationalViewport,
        neighbors,
        secondOrderNeighbors,
        stateNeighbors,
    ]
}

export default useGetReportViewport
