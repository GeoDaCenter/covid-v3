import React from 'react'
import { Stack } from '@mui/material'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { BinsList, Gutter, Tooltip, Icon } from '..'
import colors from '../../config/colors'
import { paramsSelectors, paramsActions } from '../../stores/paramsStore'
const { selectColorFilter } = paramsSelectors
const { setColorFilter } = paramsActions

const BottomPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  background: ${colors.gray};
  transform: translateX(-50%);
  width: 38vw;
  max-width: 500px;
  box-sizing: border-box;
  padding: 0 1em 0.5em 1em;
  margin: 0;
  border: 1px solid ${colors.black};
  border-bottom: none;
  transition: 250ms all;
  color: white;
  hr {
    opacity: 0.5;
  }
  @media (max-width: 1024px) {
    width: 50vw;
    div {
      padding-bottom: 5px;
    }
    #binModeSwitch {
      position: absolute !important;
      right: 10px !important;
      top: 10px !important;
    }
    #dateRangeSelector {
      position: absolute !important;
      left: 66% !important;
      transform: translateX(-50%) !important;
      top: 10px !important;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 0;
    left: 0;
    transform: none;
  }
  @media (max-width: 750px) and (orientation: landscape) {
    // bottom all the way down for landscape phone
  }
  user-select: none;
`

const LegendContainer = styled.div`
  width: 100%;
  padding: 5px 0 0 0;
  box-sizing: border-box;
  div.MuiGrid-item {
    padding: 0 5px;
  }
`

const IconContainer = styled.div`
  padding: 5px 10px;
  span.icons-title {
    margin-right: 10px;
    font-weight: bold;
  }
  img {
    width: 20px;
    height: 20px;
    transform: translateY(4px);
    padding: 2px;
  }
  span.icons-text {
    margin: 0 25px 0 5px;
  }
`

const LegendTitle = styled.h3`
  text-align: center;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  padding: 0;
  margin: 0;
`

const BinLabels = styled.div`
  width: 100%;
  display: flex;
  margin-top: 0px;
  box-sizing: border-box;
  padding: 0
    ${(props) => (props.binLength > 6 ? 100 / props.binLength / 2 - 2 : 0)}%;
  .bin {
    height: 10px;
    display: inline;
    border: 0;
    margin: 0;
    flex: 2;
    font-size: 10px;
    text-align: center;
    background: none;
    text-align: center;
  }
  .bin:nth-of-type(1) {
    transform: ${(props) => (props.firstBinZero ? 'translateX(-45%)' : 'none')};
  }
  .tooltipText {
    margin-top: -5px;
    padding-bottom: 25px;
  }
`
const BinBars = styled.div`
  width: 100%;
  display: flex;
  margin-top: 3px;
  box-sizing: border-box;
  .bin {
    height: 45px;
    display: inline;
    flex: 1;
    border: 0;
    padding: 20px 0;
    margin: -20px 0;
    background: none;
    transition: 125ms padding, 125ms margin;
    &.active {
      padding-top: 10px;
      span {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
      }
    }
    span {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .bin:nth-of-type(1) {
    transform: ${(props) => (props.firstBinZero ? 'scaleX(0.35)' : 'none')};
  }
`

const DataNote = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  svg {
    height: 20px;
    width: 20px;
    display: inline-block;
    transform: translateY(5px);
    margin-right: 5px;
    fill: ${colors.yellow};
  }
`

const ZERO_COLOR = [240, 240, 240]

/**
 * Inner renderer for Legend
 *
 * @category Components/Map
 * @param {Object} props
 * @param {string[]} props.currentBins - String text for each break point
 * @param {number[][]} props.colorScale - Color values for bins in [r,g,b]
 *   format or [r,g,b,a] (0-255 scale)
 * @param {function} props.handleHover - Function for handling hover events on
 *   color bin buttons
 * @param {number[]} props.colorFilter - Active map color filter, if using
 * @param {boolean} props.shouldSeparateZero - If using quantitiatve data that
 *   separates zero, shows zero slightly differently
 * @component
 */
export const LegendInner = ({
  currentBins,
  colorScale,
  handleHover = () => {},
  colorFilter,
  shouldSeparateZero,
}) => (
  <span>
    <BinBars firstBinZero={shouldSeparateZero}>
      {shouldSeparateZero && (
        <button
          onMouseEnter={() => handleHover(ZERO_COLOR)}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover(ZERO_COLOR)}
          onBlur={() => handleHover(null)}
          className={`bin color ${colorFilter === ZERO_COLOR && 'active'}`}
          key={`${ZERO_COLOR[0]}${ZERO_COLOR[1]}`}
        >
          <span
            style={{
              backgroundColor: `rgb(${ZERO_COLOR[0]},${ZERO_COLOR[1]},${ZERO_COLOR[2]})`,
            }}
          ></span>
        </button>
      )}
      {colorScale.map((color) => (
        <button
          onMouseEnter={() => handleHover(color)}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => handleHover(color)}
          onBlur={() => handleHover(null)}
          className={`bin color ${colorFilter === color && 'active'}`}
          key={`${color[0]}${color[1]}`}
        >
          <span
            style={{
              backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`,
            }}
          ></span>
        </button>
      ))}
    </BinBars>
    <BinLabels
      firstBinZero={shouldSeparateZero}
      binLength={currentBins?.length}
    >
      {shouldSeparateZero && <div className="bin firstBin">0</div>}
      {currentBins !== undefined && <BinsList data={currentBins} />}
    </BinLabels>
  </span>
)

/**
 * Legend for the map section of the Atlas. Positioned on the bottom of the
 * screen
 *
 * @category Components/Map
 * @example
 *   function Example() {
 *     return (
 *       <Legend
 *         variableName="Population"
 *         colorScale={[
 *           [0, 0, 0],
 *           [120, 120, 120],
 *           [255, 255, 255],
 *         ]}
 *         bins={{ bins: [500, 1500, 2500] }}
 *         resource={'cinics'}
 *         note={'This is a note'}
 *         shouldSeparateZero={true}
 *       />
 *     )
 *   }
 *
 * @param {object} props
 * @param {string} props.variableName - Text for the legend title displaying
 *   variable name
 * @param {number[][]} props.colorScale - Color values for bins in [r,g,b]
 *   format or [r,g,b,a] (0-255 scale)
 * @param {object} props.bins - String text for each break point
 * @param {string[]} props.bins.bins - String text for each break point
 * @param {string[]} props.resource - Icons for resource layers, like hospitals
 *   and clinics
 * @param {string} props.note - For special cases or data issues,
 * @param {boolean} props.shouldSeparateZero - If using quantitiatve data that
 *   separates zero, shows zero slightly differently
 * @component
 */
const Legend = ({
  variableName,
  colorScale,
  bins,
  resource,
  note,
  shouldSeparateZero,
}) => {
  const dispatch = useDispatch()
  const colorFilter = useSelector(selectColorFilter)
  const handleHover = (color) => {
    dispatch(setColorFilter(color))
  }
  const { bins: currentBins } = bins

  return (
    <BottomPanel id="bottomPanel">
      <LegendContainer>
        <Stack direction="column" spacing={1} id="legend-bins-container">
          <LegendTitle>{variableName}</LegendTitle>
          {colorScale !== undefined && (
            <LegendInner
              {...{
                currentBins,
                colorScale,
                handleHover,
                colorFilter,
                shouldSeparateZero,
              }}
            />
          )}
          {resource && (
            <>
              <Gutter h={20} />
              <IconContainer>
                <span className="icons-title">Icons:</span>

                {resource.includes('clinics') && (
                  <>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/clinic_icon.png`}
                      alt=""
                    />
                    <span className="icons-text">Clinics</span>
                  </>
                )}
                {resource.includes('hospitals') && (
                  <>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/hospital_icon.png`}
                      alt=""
                    />
                    <span className="icons-text">Hospital</span>
                  </>
                )}
                {resource.includes('vaccination') && (
                  <>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/federal_site.png`}
                      alt=""
                    />
                    <span className="icons-text">
                      Vaccine Center
                      <Tooltip id="vaccineCenter" />
                    </span>
                  </>
                )}
                {resource.includes('vaccination') && (
                  <>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/participating_clinic.png`}
                      alt=""
                    />
                    <span className="icons-text">
                      Clinic
                      <Tooltip id="vaccineClinic" />
                    </span>
                  </>
                )}
                {resource.includes('vaccination') && (
                  <>
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/invited_clinic.png`}
                      alt=""
                    />
                    <span className="icons-text">
                      Invited Clinic
                      <Tooltip id="vaccineClinicInvited" />
                    </span>
                  </>
                )}
              </IconContainer>
            </>
          )}
          {note && (
            <DataNote>
              <Icon symbol="alert" />
              {note}
            </DataNote>
          )}
        </Stack>
      </LegendContainer>
    </BottomPanel>
  )
}

export default React.memo(Legend)
