import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { findAllDefaults } from '../utils'
import { wrap } from 'comlink'
import { dataActions } from '../stores/dataStore'
const { reconcileTables } = dataActions
const FetcherWorker = wrap(
    new Worker(new URL('../workers/fetcher', import.meta.url))
)
/**
 * @typedef {Object} LoadingStatus
 * @property {boolean} loading
 */

/**
 * Helper hook to load background data related to the current map view or data
 * topic. Primarily impure, a sideeffect hook that loads data into the redux
 * store. See more at {@link /src/stores/dataStore}
 *
 * @category Hooks
 * @param {Object} props
 * @param {string} props.currentGeography = '',
 * @param {boolean} props.shouldFetch = false,
 * @param {TableSpec[]} props.tables = [], Array of TableSpec objects - see
 *   {@link /src/stores/paramsStore/types.ts}
 * @param {string[]} props.currTimespans = ['latest'], List of timespans to
 *   fetch, 'latest' or 'YYYY-MM'
 * @param {DateLists} props.dateLists = {}, list of dates for indexing crosswalk
 * @param {VariableSpec} props.numeratorParams = {}, parameters for the
 *   numerator variable -- see VariableSpec
 *   {@link /src/stores/paramsStore/types.ts}
 * @param {VariableSpec} props.denominatorParams = {}, parameters for the
 *   denominator variable -- see VariableSpec
 *   {@link /src/stores/paramsStore/types.ts}
 * @param {string[]} props.adjacentMonths = [], Additional adjacent months to
 *   fetch. Similar to currTimespans
 * @returns {LoadingStatus} Loading Status
 */

function useBackgroundLoadData({
    currentGeography = '',
    shouldFetch = false,
    tables = [],
    currTimespans = ['latest'],
    dateLists = {},
    numeratorParams = {},
    denominatorParams = {},
    adjacentMonths = [],
}) {
    const dispatch = useDispatch()
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)

    useEffect(() => {
        const adjacentMainToFetch = adjacentMonths
            .map((timespan) => [
                { ...numeratorParams[0], timespan },
                { ...denominatorParams[0], timespan },
            ])
            .flat()

        const tablesToFetch = currTimespans
            .map((timespan) =>
                findAllDefaults(tables, currentGeography).map((dataspec) => ({
                    ...dataspec,
                    timespan,
                }))
            )
            .flat()

        const filesToFetch = [...adjacentMainToFetch, ...tablesToFetch]
            .flat()
            .filter(
                (f) =>
                    !f.noFile &&
                    f.timespan !== false &&
                    f.timespan !== undefined
            )

        if (shouldFetch && filesToFetch.length) {
            const getData = async () =>
                FetcherWorker.fetchAndClean(filesToFetch, dateLists)
            setIsBackgroundLoading(true)
            getData().then((data) => {
                dispatch(reconcileTables(data))
                setIsBackgroundLoading(false)
            })
        }
    }, [shouldFetch])

    return {
        isBackgroundLoading,
    }
}

export default useBackgroundLoadData
