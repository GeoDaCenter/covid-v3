export const parseTooltipData = ({
  currentData,
  currDataset,
  currIndex,
  currTables,
  geoid,
  storedGeojson,
  storedData,
}) => {
  if (!currDataset || !storedGeojson[currentData] || !currTables) return {};
  const { geography } = currDataset; // file, geography, join, name, tables
  const properties = storedGeojson[currentData].properties;

  const locProperties = properties[geoid];
  // const pop = locProperties && locProperties.population;
  let tooltipData = {  
    ...locProperties,
  };

  if (locProperties) {
    tooltipData.name = ["County"].includes(geography)
      ? locProperties.NAME + ", " + locProperties.state_abbr
      : locProperties.NAME;
  }
  
  for (let i = 0; i < currTables.length; i++) {
    const tableName = currTables[i];
    const data = storedData[tableName.name.split('.')[0]];
    if (
      data?.data &&
      data.data[geoid] &&
      data?.dates &&
      data.dates.includes(currIndex)
    ) {
      tooltipData[`${tableName.table}`] = data.data[geoid][currIndex];
      if (tableName.table === "cases" || tableName.table === "deaths") {
        tooltipData[`daily_${tableName.table}`] =
          data.data[geoid][currIndex] - data.data[geoid][currIndex - 1];
      }
    }
  }
  
  return tooltipData;
};
