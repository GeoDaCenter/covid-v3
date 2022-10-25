import { indexGeoProps, getIdOrder } from '../../utils'

const orderInts = (a, b) => a - b
const onlyUnique = (value, index, self) => self.indexOf(value) === index

function reconcileData(payload, stateData, nonReactiveData) {
    const { name, newData, timespan, error } = payload
    const isStaticData = newData && !!newData.columns & !newData.dateIndices

    const dataError =
        !newData?.dateIndices?.length ||
        (newData?.dateIndices &&
            stateData?.[name]?.dates &&
            newData.dateIndices.join('') === stateData[name].dates.join(''))

    // If the data doesn't exist, easy. Just plug in the full dataset
    // and move on to the next
    if (!nonReactiveData.hasOwnProperty(name)) {
        nonReactiveData[name] = {
            data: {},
        }
    }
    if (!stateData.hasOwnProperty(name)) {
        stateData[name] = {
            loaded: [],
            dates: [],
        }
    }

    if (error || dataError) {
        stateData?.[name]?.loaded?.push(timespan)
    }
    if (isStaticData) {
        nonReactiveData[name] = {
            data: newData.data,
        }
        stateData[name] = {
            columns: newData.columns,
            dateIndices: newData.dateIndices,
        }
    } else {
        if (!newData) return
        const { data, dateIndices } = newData
        if (!data || !dateIndices) return

        const geoids = Object.keys(data)
        if (Object.keys(nonReactiveData[name].data).length === 0) {
            for (let i = 0; i < geoids.length; i++) {
                nonReactiveData[name].data[geoids[i]] = {}
            }
        }
        for (let i = 0; i < geoids.length; i++) {
            for (let j = 0; j < dateIndices.length; j++) {
                nonReactiveData[name].data[geoids[i]][dateIndices[j]] =
                    data[geoids[i]][j]
            }
        }
        stateData[name].loaded.push(timespan)
        stateData[name].dates = [...stateData[name].dates, ...dateIndices]
            .filter(onlyUnique)
            .sort(orderInts)
    }
}

export { orderInts, onlyUnique, reconcileData, indexGeoProps, getIdOrder }
