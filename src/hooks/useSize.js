import React, {useLayoutEffect } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
/**
 * A hook to listen for dom changes in the size of an element
 * More at https://www.npmjs.com/package/@react-hook/resize-observer
 * 
 * @category Hooks
 * @param {React.ReactHTMLElement} target The HTML Reference to listen to 
 * @returns {Object} DOMRect object with the size of the element props: x,y,width,height,top,left,bottom,right
 * @example
 * const App = () => {
 *  const target = React.useRef(null)
 *  const size = useSize(target)
 *    return (
 *        <pre ref={target}>
 *        {JSON.stringify({width: size.width, height: size.height}, null, 2)}
 *        </pre>
 *    )
 * }
 * 
 */
export function useSize(target){
  const [size, setSize] = React.useState({})

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}