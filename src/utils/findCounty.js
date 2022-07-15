import CountyList from './CountyList.json'

export const findCounty = (fips) => {
    return CountyList[fips] || {
        county: "",
        centroid: [0, 0],
        state: "",
        urbanicity: ""
    }
}