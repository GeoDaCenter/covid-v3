import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { dataActions } from '../stores/dataStore'
const { loadGeojson } = dataActions

export default function useGetGeojson({
    geoda = {},
    geodaReady = false,
    currDataset = {},
    storedGeojson = {},
}) {
    const dispatch = useDispatch()
    useMemo(async () => {
        if (!geodaReady) return
        if (storedGeojson[currDataset.file]) {
            return storedGeojson[currDataset.file]
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
        storedGeojson[currDataset.file], // data
        storedGeojson[currDataset.file] &&
            storedGeojson[currDataset.file].data &&
            storedGeojson[currDataset.file].mapId &&
            true, // data ready
        undefined, // error
    ]
}
