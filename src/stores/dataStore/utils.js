import { indexGeoProps, getIdOrder } from '../../utils'

const orderInts = (a, b) => a - b
const onlyUnique = (value, index, self) => self.indexOf(value) === index

function reconcileData(payload, storedData) {
  const { name, newData, timespan, error } = payload
  const isStaticData = newData && !!newData.columns & !newData.dateIndices
  const dataError =
    (newData?.dateIndices && !newData.dateIndices.length) ||
    (newData &&
      newData.dateIndices &&
      storedData[name] &&
      storedData[name].dates &&
      newData.dateIndices.join('') === storedData[name].dates.join(''))

  // If the data doesn't exist, easy. Just plug in the full dataset
  // and move on to the next
  if (!storedData.hasOwnProperty(name)) {
    storedData[name] = {
      loaded: [],
      dates: [],
      data: {},
    }
  }
  // } else
  if (error || dataError) {
    storedData[name].loaded.push(timespan)
  }
  if (isStaticData) {
    storedData[name] = {
      ...newData,
    }
  } else {
    if (!newData) return
    const { data, dateIndices } = newData
    if (!data || !dateIndices) return

    const geoids = Object.keys(data)
    if (Object.keys(storedData[name].data).length === 0) {
      for (let i = 0; i < geoids.length; i++) {
        storedData[name].data[geoids[i]] = {}
      }
    }
    for (let i = 0; i < geoids.length; i++) {
      for (let j = 0; j < dateIndices.length; j++) {
        storedData[name].data[geoids[i]][dateIndices[j]] = data[geoids[i]][j]
      }
    }
    storedData[name].loaded.push(timespan)
    storedData[name].dates = [...storedData[name].dates, ...dateIndices]
      .filter(onlyUnique)
      .sort(orderInts)
  }
}

export { orderInts, onlyUnique, reconcileData, indexGeoProps, getIdOrder }
