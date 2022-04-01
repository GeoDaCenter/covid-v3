import * as Pbf from 'pbf';
import * as Schemas from '../schemas';

const filterVal = (val, scale) => {
  if (val > -998) {
    return val * scale;
  }
  if (val === -999) {
    return null;
  }
  if (val === -9999) {
    return undefined;
  }
  if (isNaN(val)) {
    return null;
  }
  return val * scale;
};

const filterValues = (row, scale) => {
  let cleanVals = [];
  for (let i = 0; i < row.length; i++) {
    cleanVals.push(filterVal(row[i], scale));
  }
  return cleanVals;
}

const cleanData = (data, scale) => {
  let returnData = {};
  for (let i = 0; i < data.length; i++) {
    returnData[data[i].geoid] = filterValues(data[i].vals, scale);
  }
  return returnData
}

const getDateIndices = (dateList, dates) => {
  let dateIndices = [];
  for (let i = 0; i < dateList.length; i++) {
    if (dates.includes(dateList[i])) {
      dateIndices.push(i);
    }
  }
  return dateIndices
}

export const parsePbfData = (pbfData, fileInfo, dateList) => {
  const dateIndices = getDateIndices(dateList, pbfData.dates);
  // embedded scientific scale exponent in file name
  const scale = /.e-[0-9]/g.exec(fileInfo.name)
    ? 10 ** -+/.e-[0-9]/g.exec(fileInfo.name)[0]?.split('-')[1]
    : 1;
  const cleanedData = cleanData(pbfData.row, scale);

  return {
    data: cleanedData,
    dateIndices
  }
};

export default async function getParsePbf(fileInfo, dateList) {
  return fetch(`${process.env.PUBLIC_URL}/pbf/${fileInfo.file}`)
    .then((r) => r.arrayBuffer())
    .then((ab) => new Pbf(ab))
    .then((pbf) => Schemas.Rows.read(pbf))
    .then((pbfData) => parsePbfData(pbfData, fileInfo, dateList));
}
