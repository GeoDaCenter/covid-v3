import { useState, useEffect } from 'react'
import { useGeoda } from '../contexts/Geoda'

/**
 * Hook to generate cartogram data
 *
 * @category Hooks
 * @param {Object} props
 * @param {string} props.mapId = "", jsgeoda ID of the map
 * @param {Array} props.dataForCartogram List of objects of data prepped for the
 *   cartogram calculation
 * @param {boolean} props.shouldUseCartogram = false, boolean, flag to use
 *   cartogram or not
 * @param {boolean} props.dataReady, Boolean, flag if data is fully loaded
 * @param {string} props.varId - Hash of map variables
 * @param {Object} props.order - Index order dictionary {[order: number]: geoid}
 *
 *   - See more at GeojsonDataset {@link /src/stores/dataStore/types.ts}
 *
 * @param {Object} props.geojsonData - Geojson.FeatureCollection data of current
 *   geography
 * @returns {CartogramData}
 */
function useCartogramMap({
    mapId = '',
    dataForCartogram,
    shouldUseCartogram = false,
    dataReady,
    varId,
    order,
    geojsonData,
}) {
    const { geoda, geodaReady } = useGeoda()
    const [cartogramData, setCartogramData] = useState({
        cartogramData: [],
        cartogramCenter: [0, 0],
        cartogramDataSnapshot: '',
    })
    const [geodaTimeout, setGeodaTimeout] = useState(null)
    const debounceDelay =
        dataForCartogram && dataForCartogram.length < 500 ? 0 : 250

    useEffect(() => {
        clearTimeout(geodaTimeout)
        if (
            shouldUseCartogram &&
            geodaReady &&
            dataForCartogram.length &&
            mapId.length
        ) {
            const cleanedData = dataForCartogram.map(f => f === null || f === undefined ? NaN : f)
            const getCartogramData = async () => {
                let cartogramValues = await geoda
                    .cartogram(mapId, cleanedData)
                    .then((data) => {
                        const cartogramData = []
                        let cartogramCenter = [0, 0]
                        for (let i = 0; i < data.length; i++) {
                            cartogramData.push({
                                ...data[i],
                                value: dataForCartogram[i],
                                id: order[data[i].properties.id],
                                properties: {
                                    ...geojsonData.features[i].properties,
                                },
                            })
                            cartogramCenter[0] += data[i].position[0]
                            cartogramCenter[1] += data[i].position[1]
                        }
                        cartogramCenter[0] /= data.length
                        cartogramCenter[1] /= data.length

                        return {
                            cartogramData,
                            cartogramCenter,
                            cartogramDataSnapshot: varId,
                        }
                    })
                setCartogramData(cartogramValues)
            }
            setGeodaTimeout(setTimeout(getCartogramData, debounceDelay))
        }
    }, [dataReady, varId, shouldUseCartogram, mapId, geodaReady])
    return cartogramData
}

export default useCartogramMap

/**
 * @typedef {Object} CartogramData
 * @property {Array} cartogramData List of data entries for cartogram map
 *   {value: number, id: number, properties: Object, position: [number,
 *   number]}[]
 * @property {number[]} cartogramCenter Lat/Long of the center of the
 *   cartogram. NOT the geospatial center of geographies
 * @property {string} cartogramDataSnapshot ID of the snapshot data
 */
