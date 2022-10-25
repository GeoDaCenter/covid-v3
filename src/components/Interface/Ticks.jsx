import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const TickMarksContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 2px;
  position: absolute;
  top: calc(50% + 1px);
  transform: translateY(-50%);
`

const TickCanvas = styled.canvas`
  width: 100%;
  height: 6px;
  transform: translateY(1px);
`
/**
 * A canvas-based tick rendered for date availability Each date is rendered
 * individual tick for non-contiguous dates The tick container will conform to
 * parent width
 *
 * @category Components/Interface
 * @example
 *   function ExampleComponent() {
 *     return <Ticks available={[1, 0, 1, 1, 0, 1]} fullLength={6} />
 *   }
 *
 * @param {Object} props
 * @param {boolean[]} props.available A list of boolean or falsy/truthy values
 *   indicating whether a tick (a date) is available or not
 * @param {number} props.fullLength The full length of time values
 * @component
 */
export default function Ticks({ available, fullLength }) {
  const canvasRef = useRef(null)
  const draw = (ctx, startX, color) => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(startX, 0, startX + 1, 50)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    for (let i = 0; i < fullLength; i++) {
      draw(
        context,
        context.canvas.width * (i / fullLength),
        available[i] ? 'white' : 'black'
      )
    }
  }, [fullLength, JSON.stringify(available)])

  return (
    <TickMarksContainer>
      <TickCanvas ref={canvasRef} />
    </TickMarksContainer>
  )
}
