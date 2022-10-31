/**
 * URL Parameters tree, for share URLS. {[Key: string]: {name: string,
 * geography: string}}
 *
 * @category Configuration
 * @type {Object}
 */
export const urlParamsTree = {
    'county_usfacts.geojson': {
        name: 'USA Facts',
        geography: 'County',
    },
    'county_1p3a.geojson': {
        name: '1Point3Acres',
        geography: 'County',
    },
    'county_nyt.geojson': {
        name: 'New York Times',
        geography: 'County',
    },
    'state_1p3a.geojson': {
        name: '1Point3Acres',
        geography: 'State',
    },
    'state_usafacts.geojson': {
        name: 'USA Facts',
        geography: 'State',
    },
    'state_nyt.geojson': {
        name: 'New York Times',
        geography: 'State',
    },
    'global_jhu.geojson': {
        name: 'John Hopkins University',
        geography: 'Global',
    },
    'cdc.geojson': {
        name: 'CDC',
        geography: 'County',
    },
    // 'cdc_h.geojson': {
    //   name: 'CDC',
    //   geography: 'County (Hybrid)',
    // },
    'safegraph.geojson': {
        name: 'Safegraph',
        geography: 'County',
    },
}
