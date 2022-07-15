import * as Pbf from "pbf";
import * as Schemas from "../schemas";

import { getParseCsvPromise, parsePbfData } from "../utils";
import { expose } from 'comlink'

class Fetcher {
    constructor() { 

    }
    fetchFile(fileInfo, dateLists) {
        const { name, filetype, timespan, date } = fileInfo;
        if (!name || !filetype) return () => [];
        if (filetype === "pbf") {
            return fetch(
                `${process.env.PUBLIC_URL}/pbf/${name}${timespan ? `.${timespan}` : ""
                }.pbf`
            )
                .then((r) => r.arrayBuffer())
                .then((ab) => new Pbf(ab))
                .then((pbf) => Schemas.Rows.read(pbf))
                .then((pbfData) => parsePbfData(pbfData, fileInfo, dateLists[date]));
        }
        return getParseCsvPromise(fileInfo, dateLists[date]);
    };
    async fetch(filesToFetch = [], dateLists) {
        return filesToFetch && filesToFetch.length && !filesToFetch[0].noFile
            ? await Promise.allSettled(filesToFetch.map((file) => this.fetchFile(file, dateLists)))
            : () => [];
    }
    async fetchAndClean(filesToFetch = [], dateLists) {
        const dataArray = await this.fetch(filesToFetch, dateLists);
        if (dataArray.length) {

            const mappedData = dataArray.map((response, idx) => {
                const newData = response.value;
                if (newData && newData.data) {
                    return {
                        name: filesToFetch[idx].name,
                        newData,
                        timespan: filesToFetch[idx].timespan
                    }
                } else if (response.status === 'rejected') {
                    return {
                        name: filesToFetch[idx].name,
                        newData: {},
                        error: true,
                        timespan: filesToFetch[idx].timespan
                    }
                }
                return {
                    name: null,
                    newData: {},
                    error: true,
                    timespan: null
                }
            })

            return mappedData
        }
    }
}

expose(new Fetcher());