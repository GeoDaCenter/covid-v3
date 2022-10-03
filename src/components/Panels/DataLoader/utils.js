/**
 * Rudimentary GeoJSON validation.
 * 
 * @param {GeoJSON.FeatureCollection} content 
 * @returns {Array} [Error: string, isValid: boolean]
 */
export const validateGeojson = (content) => {
  if (!content) {
    return ["Please select a file.", false];
  }
  if (
    content.crs?.properties?.name &&
    !content.crs.properties.name.includes("CRS84")
  ) {
    return ["Geospatial data must be in WGS84 projection.", false];
  }
  if (content.features === undefined || !content.features.length) {
    return ["No features detected.", false];
  }

  return [false, true];
};
