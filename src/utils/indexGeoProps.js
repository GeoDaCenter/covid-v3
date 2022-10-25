/**
 * Assign an array of geo objects (eg. Features of a GeoJSON) into an indexed
 * object based on the provided key property
 *
 * @category Utils/Data
 * @example
 *     const data = {
 *     type: "FeatureCollection",
 *     features: [
 *     { type: "Feature", properties: { id: "1", name: "A" }, geometry: { ... } },
 *     { type: "Feature", properties: { id: "2", name: "B" }, geometry: { ... } },
 *     ]
 *     }
 *     const indexedData = indexGeoProps(data, "id")
 *     // indexedData = {
 *     //  "1": { type: "Feature", properties: { id: "1", name: "A" }, geometry: { ... } },
 *     //  "2": { type: "Feature", properties: { id: "2", name: "B" }, geometry: { ... } },
 *     // }
 *
 * @param {Object} data Geojson-like object to be assigned
 * @param {String} key Key inside properties to index rows on
 * @returns {Object} Indexed geodata for faster access
 */
export const indexGeoProps = (data, key) => {
    if (!data) return {}
    let geoProperties = {}
    if (!key) {
        for (let i = 0; i < data.features.length; i++) {
            geoProperties[i] = data.features[i].properties
        }
    } else {
        for (let i = 0; i < data.features.length; i++) {
            geoProperties[data.features[i].properties[key]] =
                data.features[i].properties
        }
    }
    return geoProperties
}
