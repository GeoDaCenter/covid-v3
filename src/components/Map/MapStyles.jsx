import styled from 'styled-components'
import MAP_STYLE_DARK from '../../config/style.json'
import MAP_STYLE_LIGHT from '../../config/style_light.json'
import colors from '../../config/colors'

export const MAP_STYLES = {
  light: MAP_STYLE_LIGHT,
  dark: MAP_STYLE_DARK,
}

// component styling
export const MapContainerOuter = styled.div`
  position: relative;
  /* width: 100%; */
  height: ${(props) => (props.isReport ? '100%' : 'calc(100vh - 50px)')};
  flex: 1;
  pointer-events: ${(props) =>
    props.noData || props.isReport ? 'none' : 'auto'};
`
export const MapContainer = styled.div`
  #deckgl-wrapper {
    width: 100%;
    transition: 125ms all;
  }
  height: 100%;
  background: ${(props) => (props.isReport ? colors.white : colors.darkgray)};
  overflow: hidden;
  @media (max-width: 600px) {
    div.mapboxgl-ctrl-geocoder {
      display: none;
    }
  }
`
export const IndicatorBox = styled.div`
  position: fixed;
  border: 1px dashed #ffce00;
  background: rgba(0, 0, 0, 0.25);
  z-index: 5;
  left: -5px;
  right: -5px;
  width: 0;
  height: 0;
`
export const GeocoderContainer = styled.div`
  position: fixed;
  right: 7px;
  top: 7px;
  z-index: 500;
  width: 250px;
  @media (max-width: 1024px) {
    right: 57px;
  }
  @media (max-width: 600px) {
    display: none;
  }
`
