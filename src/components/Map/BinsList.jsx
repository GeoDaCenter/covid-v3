import React from 'react'
import { Tooltip } from '..'
import { formatNumber } from '../../utils'

/**
 * Renderer for the legend of the map
 *
 * @category HelperComponents
 * @example
 *   function myComponent() {
 *     const data = [
 *       '5 tooltip:more-info-1',
 *       '10 tooltip:more-info-2',
 *       '15 tooltip:more-info-3',
 *     ]
 *     return <BinList data={data} />
 *   }
 *
 * @param {Object} props
 * @param {string[]} props.data List of tooltip values, including tooltip if
 *   using
 * @component
 */
const BinsList = ({ data = [] }) => {
  const bins = data.map((bin) => formatNumber(bin))
  const binClassName = bins.some((bin) => bin.includes('tooltip'))
    ? 'bin label tooltipText'
    : 'bin label'
  // Return div with bins, tooltip if using
  return bins.map((bin, index) => (
    <div key={`${bin}_${index}`} className={binClassName}>
      {bin.split(' tooltip:')[0]}
      {bin.includes('tooltip') && <Tooltip id={bin.split(' tooltip:')[1]} />}
    </div>
  ))
}

export default BinsList
