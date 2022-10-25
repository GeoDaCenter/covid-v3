import React from 'react'
import * as SVG from '../../config/svg.js'

/**
 * An icon helper component
 *
 * @category Components/Interface
 * @example
 *   function MyComponent() {
 *     return (
 *       <Icon symbol="policy" style={{ width: '4rem', height: '4rem' }} />
 *     )
 *   }
 *
 * @param {Object} props
 * @param {string} props.symbol - The name of the icon to display One of the
 *   valid keys of the SVG object in src/config/svg.js
 * @param {object} props.style Any valid CSS to apply to span wrapper of symbol
 * @component
 */
const Icon = ({ symbol, style }) => {
  return <span {...style}>{SVG[symbol]}</span>
}

export default Icon
