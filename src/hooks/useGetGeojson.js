import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { dataActions, dataSelectors } from '../stores/dataStore'
const { loadGeojson } = dataActions
const { selectGeojsonData } = dataSelectors

/**
 * Fetcher hook to load geojson data through jsgeoda or return existing load
 * data from the redux store
 *
 * @param {Object} props
 * @param {Object} props.geoda Jsgeoda instance
 * @param {boolean} props.geodaReady Flag to indicate if geoda is ready
 * @param {string} props.currDataset Name of current geojson dataset
 * @returns {Array | undefined} Positional return for easy renaming [Geojson:
 *   GeojsonDataset, dataReady: boolean, error: string] See GeojsonDataset at
 *   {@link src/stores/dataStore/type.ts}
 */
function useGetGeojson({ geoda = {}, geodaReady = false, currDataset = {} }) {
    const geoData = useSelector(selectGeojsonData(currDataset.file))
    const dispatch = useDispatch()
    useMemo(async () => {
        if (!geodaReady) return
        if (!!geoData?.weights) {
            return geoData
        } else {
            const [mapId, data] = await geoda.loadGeoJSON(
                `${process.env.PUBLIC_URL}/geojson/${currDataset.file}`,
                currDataset.join
            )
            dispatch(
                loadGeojson({
                    [currDataset.file]: {
                        data,
                        mapId,
                        joinCol: currDataset.join,
                    },
                })
            )
        }
    }, [geodaReady && JSON.stringify(currDataset)])

    if (!geodaReady) {
        return [
            {}, // data
            false, // data ready
            undefined, // error
        ]
    }
    return [
        geoData,
        !!geoData?.data && !!geoData?.mapId && !!geoData?.weights, // dataReady
        undefined, // error
    ]
}

export default useGetGeojson
