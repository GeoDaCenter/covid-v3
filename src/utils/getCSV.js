import * as Papa from "papaparse";

async function getCSV(url) {
  const tempData = await fetch(url)
    .then((response) => {
      return response.ok ? response.text() : Promise.reject(response.status);
    })
    .then((text) => {
      let data = Papa.parse(text, {header: true, dynamicTyping: true});

      return data.data;
    });

  return tempData;
}

export default getCSV;
