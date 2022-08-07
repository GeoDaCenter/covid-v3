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
    const { table, name } = currTables[i];

    const tableData = storedData[name];
    if (!tableData) continue;

    const { data, dates } = tableData;
    if (data?.[geoid] && dates) {
      const dataIndex = dates.includes(currIndex)
        ? currIndex
        : dates?.slice(-1)[0];

      tooltipData[`${table}`] = data[geoid][dataIndex];
      if (table === "cases" || table === "deaths") {
        tooltipData[`daily_${table}`] =
          data[geoid][dataIndex] - data[geoid][dataIndex - 1];
      }
    }
  }

  return tooltipData;
};
