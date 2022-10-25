// general imports, state
import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import throttle from 'lodash.throttle'
import styled from 'styled-components'
import colors from '../../config/colors'

const Container = styled.div`
  flex: auto;
  width: 100%;
  .MuiFormControl-root {
    margin: 0;
  }
  .MuiAutocomplete-inputRoot {
    background: white;
    height: 36px;
    border-radius: 0px;
    padding: 0 5px;
  }
  .MuiAutocomplete-inputRoot[class*='MuiInput-root']
    .MuiAutocomplete-input:first-child {
    padding: 0;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid ${colors.yellow};
  }
  .MuiInput-underline:after {
    border-bottom: 2px solid ${colors.strongOrange};
  }
  .MuiFormControl-root .MuiInputBase-adornedEnd:before {
    display: block;
    content: ' ';
    background-image: url('${process.env.PUBLIC_URL}/assets/img/search.svg');
    background-size: 20px 20px;
    height: 20px;
    width: 20px;
    border-bottom: none !important;
  }
  .MuiOutlinedInput-input {
    color: black;
  }
`

const StyledOption = styled.button`
  cursor: pointer;
  background: none;
  color: black;
  width: 100%;
  border: none;
  text-align: left;
  padding: 0.5em 0.75em;
  span {
    display: block;
    font-size: 1em;
    &:first-child {
      font-size: 1.375em;
      font-weight: bold;
      padding-bottom: 0.5em;
    }
  }
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`
/**
 * Geocoder autocomplete wrapper for Mapbox API. Could be repurposed for other
 * geocoders. Based on https://mui.com/material-ui/react-autocomplete/
 *
 * @category Components/Interface
 * @example
 *   function ExampleComponent() {
 *     const [location, setLocation] = useState(null)
 *     return (
 *       <Geocoder
 *         placeholder="Search for a location"
 *         onChange={setLocation}
 *         API_KEY={process.env.REACT_APP_MAPBOX_API_KEY}
 *         style={{
 *           color: 'skyblue',
 *         }}
 *       />
 *     )
 *   }
 *
 * @param {Object} props
 * @param {String} props.placeholder - Placeholder text for autocomplete input
 * @param {Function} props.onChange - Callback for when a location is selected
 * @param {Object} props.style - CSS Styles passed to autocomplete component
 * @param {String} props.API_KEY - Mapbox API key to use for temporary geocoding
 * @component
 */
const Geocoder = ({ placeholder, onChange, style, API_KEY }) => {
  const [searchState, setSearchState] = useState({
    results: [],
    value: '',
  })

  const loadResults = (results) => {
    setSearchState((prev) => ({
      ...prev,
      results,
    }))
  }

  const clearInput = () => {
    setSearchState({
      results: [],
      value: '',
    })
  }

  const buildAddress = (text) =>
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${API_KEY}&country=US&autocomplete=true&types=region%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Caddress`

  const getMapboxResults = async (text, callback) =>
    fetch(buildAddress(text))
      .then((r) => r.json())
      .then((r) => callback(r.features))

  const queryMapbox = React.useMemo(
    () =>
      throttle((text, callback) => {
        getMapboxResults(text, callback)
      }, 200),
    []
  )

  //
  const handleSearch = async (e) => {
    if (e.target.value.length > 3) {
      queryMapbox(e.target.value, (r) => loadResults(r))
    }
  }

  const formatPlaceContext = (contextArray) => {
    let returnString = ``
    for (let i = 0; i < contextArray.length; i++) {
      if (
        contextArray[i].id.includes('region') ||
        contextArray[i].id.includes('country') ||
        contextArray[i].id.includes('place') ||
        contextArray[i].id.includes('neighborhood')
      ) {
        returnString += `${contextArray[i].text}, `
      }
    }
    return returnString.slice(0, -2)
  }

  return (
    <Container>
      <Autocomplete
        id="geocoder search"
        freeSolo
        disableClearable
        filterOptions={(x) => x}
        autoComplete
        clearOnEscape
        inputValue={searchState.value}
        options={searchState.results}
        getOptionLabel={(option) => option.place_name}
        onChange={(source, selectedOption) => {
          clearInput()
          onChange(selectedOption)
        }}
        renderOption={(_key, option) => (
          <StyledOption id={_key.key} onClick={() => onChange(option)}>
            <span>{option?.place_name && option.place_name.split(',')[0]}</span>
            <span>{formatPlaceContext(option?.context)}</span>
          </StyledOption>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            placeholder={placeholder}
            InputProps={{ ...params.InputProps, type: 'search' }}
            value={searchState.value}
            onChange={(e) => {
              setSearchState((prev) => ({
                ...prev,
                value: e.target.value,
              }))
              handleSearch(e)
            }}
          />
        )}
        style={style}
      />
    </Container>
  )
}

export default Geocoder
