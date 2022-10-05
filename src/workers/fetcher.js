import * as Pbf from 'pbf'
import * as Schemas from '../schemas'
import { getParseCsvPromise, parsePbfData } from '../utils'
import { expose } from 'comlink'
/**
 * 
 * @category Utils/fetchers
 * 
 * @class
 * @classdesc File fetcher and parser, especially for Pbf custom schema.
 */
class Fetcher {
  /**
   * Main method to fetch a single data file
   * 
   * @param {FileInfo} fileInfo 
   * @param {Object} dateLists List of date values, typically {isoDateList: ['01-01-2021', '01-02-2021', ...]}
   * @returns {Promise} Promise with data
   */
  fetchFile(fileInfo, dateLists) {
    const { name, filetype, timespan, date } = fileInfo
    if (!name || !filetype) return () => []
    if (filetype === 'pbf') {
      return fetch(
        `${process.env.PUBLIC_URL}/pbf/${name}${
          timespan ? `.${timespan}` : ''
        }.pbf`
      )
        .then((r) => r.arrayBuffer())
        .then((ab) => new Pbf(ab))
        .then((pbf) => Schemas.Rows.read(pbf))
        .then((pbfData) => parsePbfData(pbfData, fileInfo, dateLists[date]))
    }
    return getParseCsvPromise(fileInfo, dateLists[date])
  }

  /**
   * Fetch a list of files and index available dates to provided dateLists.
   * @param {Array} filesToFetch List of files to fetch
   * @param {Object} dateLists Object with date lists
   */
  async fetch(filesToFetch = [], dateLists) {
    return filesToFetch && filesToFetch.length && !filesToFetch[0].noFile
      ? await Promise.allSettled(
          filesToFetch.map((file) => this.fetchFile(file, dateLists))
        )
      : () => []
  }
  /**
   * Fetch a list of files and index available dates to provided dateLists.
   * Cleans output before return
   * @param {Array} filesToFetch List of files to fetch
   * @param {Object} dateLists Object with date lists
   */
  async fetchAndClean(filesToFetch = [], dateLists) {
    const dataArray = await this.fetch(filesToFetch, dateLists)
    if (dataArray.length) {
      const mappedData = dataArray.map((response, idx) => {
        const newData = response.value
        if (newData && newData.data) {
          return {
            name: filesToFetch[idx].name,
            newData,
            timespan: filesToFetch[idx].timespan,
          }
        } else if (response.status === 'rejected') {
          return {
            name: filesToFetch[idx].name,
            newData: {},
            error: true,
            timespan: filesToFetch[idx].timespan,
          }
        }
        return {
          name: null,
          newData: {},
          error: true,
          timespan: null,
        }
      })

      return mappedData
    }
  }
}

expose(new Fetcher())

/**
 * @typedef {Object} FileInfo
 * @property {String} name Name of the file
 * @property {String} filetype Filetype of the file
 * @property {boolean} accumulate Whether to accumulate timeseries data or not
 * @property {String} join Join ID column to use, if applicable
 * @property {String} timespan Timespan of the file
 * @property {String} date Date of the file
 */