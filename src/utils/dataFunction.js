/**
 * General data function for fast decision tree with a numerator and
 * denominator. Calculates for a single geography.
 *
 * @category Utils/Data
 * @example
 *     const numeratorData = {
 *         cases: 500,
 *     }
 *     const denominatorData = {
 *         population: 100,
 *     }
 *     const dataParams = {
 *         nProperty: 'cases',
 *         dProperty: 'population',
 *         scale: 1000,
 *     }
 *     const result = dataFunction(numeratorData, denominatorData, dataParams) // 5000
 *
 * @param {DataRow} numeratorData - Object with data values for a single row.
 *   The numerator data, see DataRow {@link src/stores/dataStore/types.ts}
 * @param {DataRow} denominatorData - Object with data values for a single row.
 *   The denomiantor data, see DataRow {@link src/stores/dataStore/types.ts}
 * @param {Object} dataParams - Parameters for the data function, see
 *   VariableSpec {@link src/stores/paramsStore/types.ts}
 */
const dataFn = (numeratorData, denominatorData, dataParams) => {
    const { nProperty, nIndex, dProperty, dIndex, nType, dType, scale } =
        dataParams

    const nRange = nIndex <= dataParams.nRange ? nIndex : dataParams.nRange
    const dRange = dIndex <= dataParams.dRange ? dIndex : dataParams.dRange

    if (numeratorData === undefined || denominatorData === undefined) {
        return null
    }

    if (
        (nProperty !== null &&
            (numeratorData[nProperty] === undefined ||
                numeratorData[nProperty] === null)) ||
        (nIndex !== null &&
            nProperty === null &&
            (numeratorData[nIndex] === undefined ||
                numeratorData[nIndex] === null))
    ) {
        return null
    }

    if (nType === 'time-series' && dType === 'time-series') {
        if ((nRange === null) & (dRange === null)) {
            return (numeratorData[nIndex] / denominatorData[dIndex]) * scale
        } else {
            return (
                ((numeratorData[nIndex] - numeratorData[nIndex - nRange]) /
                    nRange /
                    ((denominatorData[dIndex] -
                        denominatorData[dIndex - dRange]) /
                        dRange)) *
                scale
            )
        }
    }

    if (dProperty === null && nRange === null) {
        // whole count or number -- no range, no normalization
        return (numeratorData[nProperty] || numeratorData[nIndex]) * scale
    }

    if (dProperty === null && nRange !== null) {
        // range number, daily or weekly count -- no normalization
        return (
            ((numeratorData[nIndex] - numeratorData[nIndex - nRange]) /
                nRange) *
            scale
        )
    }

    if (dProperty !== null && nRange === null) {
        // whole count or number normalized -- no range
        return (
            ((numeratorData[nProperty] || numeratorData[nIndex]) /
                (denominatorData[dProperty] || denominatorData[dIndex])) *
            scale
        )
    }

    if (dProperty !== null && nRange !== null && dRange === null) {
        // range number, daily or weekly count, normalized to a single value
        return (
            ((numeratorData[nIndex] - numeratorData[nIndex - nRange]) /
                nRange /
                (denominatorData[dProperty] || denominatorData[dIndex])) *
            scale
        )
        // } else if (dProperty!==null&&nRange!==null&&dRange!==null){ // range number, daily or weekly count, normalized to a range number, daily or weekly count
        //   console.log('getting the right col')
        //   return (
        //     (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)
        //     /
        //     ((denominatorData[dIndex]-denominatorData[dIndex-dIndex])/dIndex)
        //     *scale
    }

    return null
}

export default dataFn

// Pretty sweet branchless variant
// const dataFn = (numeratorData, numeratorProperty, index, range, denominatorData, denominatorProperty, denominatorIndex, denominatorRange, scale)  => {

//     return (
//       (
//         (
//           (
//             (numeratorData[index]||numeratorData[numeratorProperty])
//             -
//             ((range!==null)&&(numeratorData[index-range]))
//           )

//           /
//           (range+(range===null))
//         )
//       /
//         (
//           (
//             (
//               (denominatorData[denominatorIndex]||denominatorData[denominatorProperty])
//               -
//               ((denominatorRange!==null)&&(denominatorData[denominatorIndex-denominatorRange]))
//             )
//             /
//             (denominatorRange+(denominatorRange===null))
//           )
//           ||
//             (denominatorData[denominatorProperty])
//           ||
//           1
//         )
//       )
//       *
//       scale
//     )
// }
