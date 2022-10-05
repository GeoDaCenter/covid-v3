import React, { useState } from 'react'
import styled from 'styled-components'
import { ComboBox, Icon, StyledDropDown, StyledSlider } from '..'
import colors from '../../config/colors'
import {} from '..'
import {
    Stack,
    Typography,
    InputLabel,
    Popover,
    MenuItem,
    Switch,
    Select,
    TextField,
    Checkbox,
} from '@mui/material'

/**
 * Outer container (div) for the popover
 *
 * @category HelperComponents
 * @param {Object} props
 * @param {React.ReactNode} props.children - Inner content
 * @param {boolean} props.inline - Boolean to display block or absolute
 * @param {number} props.left - LEFT positioning for the button + container
 * @param {number} props.right - RIGHT positioning for the button + container
 * @param {number} props.top - TOP positioning for the button + container
 * @param {number} props.bottom - BOTTOM positioning for the button + container
 * @param {number} props.size - Width and height of the button in REM
 * @param {string} props.color - Color of button
 * @component
 */
const PopoverContainer = styled.div`
    position: ${({ inline }) => (inline ? 'block' : 'absolute')};
    left: ${(props) =>
        props.left !== undefined
            ? typeof props.left === 'string'
                ? props.left
                : 0
            : 'initial'};
    bottom: ${(props) =>
        props.bottom !== undefined
            ? typeof props.bottom === 'string'
                ? props.bottom
                : 0
            : 'initial'};
    right: ${(props) =>
        props.right !== undefined
            ? typeof props.right === 'string'
                ? props.right
                : 0
            : 'initial'};
    top: ${(props) =>
        props.top !== undefined
            ? typeof props.top === 'string'
                ? props.top
                : 0
            : 'initial'};
    width: ${({ size }) => size}rem;
    height: ${({ size }) => size}rem;
    z-index: 500;
    overflow-y: visible;
    button {
        width: 100%;
        height: 100%;
        border: none;
        background: none;
        cursor: pointer;
        opacity: 0.6;
        transition: 250ms all;
        svg {
            width: 60%;
            height: 60%;
            stroke: ${(props) => props.color};
            fill: none;
            path {
                fill: ${(props) => props.color};
            }
        }
        &:hover {
            opacity: 1;
        }
    }
`

const PopoverContent = styled.div`
    display: flex;
    flex-direction: column;
    background: ${colors.gray};
    border: 1px solid ${colors.yellow};
    color: ${colors.white};
    padding: 1em;
    overflow-x: hidden;
    overflow-y: visible;
`

const H3 = ({ content }) => <h3>{content}</h3>
const P = ({ content }) => <p>{content}</p>
const Label = ({ content }) => <label>{content}</label>

/**
 * Select / dropdown control called as a composition in ControlPopover
 *
 * @category HelperComponents
 * @example
 *     function MyComponent() {
 *         return (
 *             <ControlPopover
 *                 bottom
 *                 left
 *                 controlElements={[
 *                     {
 *                         type: 'select',
 *                         action: (value) => console.log(value),
 *                         value: { value: '1', label: 'Option 1' },
 *                         content: {
 *                             label: 'My Options',
 *                             items: [
 *                                 {
 *                                     text: 'Option 1',
 *                                     value: '1',
 *                                 },
 *                                 {
 *                                     text: 'Option 2',
 *                                     value: '2',
 *                                 },
 *                             ],
 *                         },
 *                     },
 *                 ]}
 *             />
 *         )
 *     }
 *
 * @param {Object} props.content Content {label: string, items: {value: any,
 *   text: string|null, label: string|null}[]}
 * @param {string} props.content.label String label for the control
 * @param {Object[]} props.content.items Array of objects with value, text, and
 *   label If using nested, add subItems to each item with the same structure
 * @param {Object | string[]} props.value Value of the control as {value: any,
 *   label: any}. When using `multiple`, an array of value strings.
 * @param {function} props.action Function to call on change
 * @param {boolean} props.multiple Boolean to allow multiple selections. Use
 *   SelectMultiControl
 * @param {boolean} props.nested If true, nests rows of checkbox options
 * @param {boolean} props.autocomplete If true, uses autocomplete search instead
 *   of select
 * @param {boolean} props.active Boolean passed to StyledDropDown for
 *   highlighted state overload props passed to MuiSelect
 *   https://mui.com/material-ui/react-select/
 * @component
 */
const SelectControl = (
    { content, value, action, active = false, multiple, nested, autocomplete },
    rest
) => {
    if (autocomplete) {
        return (
            <ComboBox
                MenuProps={{ id: 'variableMenu' }}
                value={value}
                setValue={action}
                options={content.items}
                label={content.label}
                {...rest}
            />
        )
    } else {
        return (
            <StyledDropDown
                style={{ marginTop: '1.5em', width: '100%' }}
                active={active}
            >
                <InputLabel htmlFor="variableSelect">
                    {content.label}
                </InputLabel>
                <Select
                    MenuProps={{ id: 'variableMenu' }}
                    value={value}
                    multiple={multiple || nested}
                    onChange={action}
                    {...rest}
                >
                    {nested
                        ? content.items.map((item, index) => (
                              <Stack
                                  key={index}
                                  direction="column"
                                  alignItems="center"
                                  sx={{
                                      padding: '.5em 1em 0 1em',
                                      borderBottom: '1px solid white',
                                  }}
                              >
                                  <Typography fontWeight="bold">
                                      {item.text || item.label}
                                  </Typography>
                                  <Stack direction="row">
                                      {item.subItems.map(
                                          (subItem, subIndex) => (
                                              <MenuItem
                                                  key={subIndex}
                                                  value={subItem.value}
                                                  onClick={() =>
                                                      action(subItem.value)
                                                  }
                                              >
                                                  <Checkbox
                                                      key={subIndex}
                                                      checked={
                                                          value.indexOf(
                                                              subItem.value
                                                          ) > -1
                                                      }
                                                  />
                                                  {subItem.text ||
                                                      subItem.label}
                                              </MenuItem>
                                          )
                                      )}
                                  </Stack>
                              </Stack>
                          ))
                        : content.items.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                  {item.text || item.label}
                              </MenuItem>
                          ))}
                </Select>
            </StyledDropDown>
        )
    }
}

const SelectMultiControl = (props) => <SelectControl {...props} multiple />
const SelectNestedMultiControl = (props) => (
    <SelectControl {...props} nested multiple />
)
const ComboBoxControl = (props) => <SelectControl {...props} autocomplete />

const StyledSwitch = styled.div`
    margin: 0 5px;
    @media (max-width: 960px) {
        margin: 0;
    }
    p {
        color: white;
        display: inline;
        text-align: center;
    }
    span.MuiSwitch-track {
        background-color: ${colors.lightgray};
    }
    .MuiSwitch-colorSecondary.Mui-checked {
        color: ${colors.lightblue};
    }
    .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
        background-color: ${colors.lightblue};
    }
    .MuiSwitch-colorSecondary:hover {
        background-color: ${colors.lightblue}55;
    }
`

/**
 * Switch on-off component for control popover
 *
 * @category HelperComponents
 * @example
 *     function MyComponent() {
 *         return (
 *             <ControlPopover
 *                 controlElements={[
 *                     {
 *                         type: 'switch',
 *                         action: (value) => console.log(value),
 *                         value: true,
 *                         content: 'My Switch',
 *                     },
 *                 ]}
 *             />
 *         )
 *     }
 *
 * @param {string} content Label for switch
 * @param {boolean} value Value of switch
 * @param {function} action Function to call on change
 * @component
 */
const SwitchControl = ({ content, value, action }) => (
    <StyledSwitch>
        <Switch
            checked={value}
            onChange={action}
            name="log chart switch"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <p>{content}</p>
    </StyledSwitch>
)

const StyledSliderContainer = styled.div`
    span.MuiSlider-rail {
        display: initial;
    }
`

const SliderControl = ({ content, value, action }) => (
    <StyledSliderContainer>
        <label>{content.label}</label>
        <StyledSlider {...{ value, ...content }} onChange={action} />
    </StyledSliderContainer>
)

const StyledTextField = styled(TextField)`
    label.MuiInputLabel-root {
        color: ${colors.white};
    }
    input.MuiInput-input:before,
    .MuiInputBase-input {
        border-bottom: 1px solid ${colors.white};
    }
`

const CloseButton = styled.button`
    position: absolute;
    top: -0.5em;
    right: -0.125em;
    padding: 0.75em;
    background: none;
    color: white;
    border: none;
    font-size: 1rem;
    cursor: pointer;
`

const TextInputControl = ({ content, value, action }) => (
    <StyledTextField
        fullWidth
        id="standard-basic"
        variant="standard"
        value={value}
        onChange={action}
    />
)

export const ControlElementMapping = {
    header: H3,
    helperText: P,
    label: Label,
    select: SelectControl,
    switch: SwitchControl,
    slider: SliderControl,
    comboBox: ComboBoxControl,
    textInput: TextInputControl,
    selectMulti: SelectMultiControl,
    selectNestMulti: SelectNestedMultiControl,
    // geocoder: Geocoder,
    // size: Size,
}
/**
 * A popover that contains a list of controls for a given component Can be
 * positioned in any corner
 *
 * @category Components/Interface
 * @example
 *     function MyComponent() {
 *         return (
 *             <ControlPopover
 *                 size={4}
 *                 top
 *                 bottom
 *                 iconColor="blue"
 *                 controlElements={[
 *                     {
 *                         type: 'header',
 *                         content: 'My Header',
 *                     },
 *                     {
 *                         type: 'helperText',
 *                         content: 'My Helper Text',
 *                     },
 *                     {
 *                         type: 'label',
 *                         content: 'My Label',
 *                     },
 *                     {
 *                         type: 'select',
 *                         content: {
 *                             label: 'My Select',
 *                             items: [
 *                                 { value: 'value1', label: 'Text 1' },
 *                                 { value: 'value2', label: 'Text 2' },
 *                                 { value: 'value3', label: 'Text 3' },
 *                             ],
 *                             value: { value: 'value1', label: 'Text 1' },
 *                             action: (value) => console.log(value),
 *                         },
 *                     },
 *                     {
 *                         type: 'switch',
 *                         action: (value) => console.log(value),
 *                         value: true,
 *                         content: 'My Switch',
 *                     },
 *                     {
 *                         type: 'slider',
 *                         content: {
 *                             min: 0,
 *                             max: 100,
 *                             step: 1,
 *                         },
 *                         value: 50,
 *                         action: (value) => console.log(value),
 *                     },
 *                     {
 *                         type: 'comboBox',
 *                         content: {
 *                             items: [
 *                                 { value: 'value1', label: 'Text 1' },
 *                                 { value: 'value2', label: 'Text 2' },
 *                             ],
 *                         },
 *                         value: { value: 'value1', label: 'Text 1' },
 *                         action: (value) => console.log(value),
 *                     },
 *                 ]}
 *             />
 *         )
 *     }
 *
 * @param {Object} props
 * @param {number} props.size Size of clickable icon in REM
 * @param {boolean} props.inline Display inline or absolutely positioned
 * @param {boolean} props.top If true, position on top of parent
 * @param {boolean} props.bottom If true, position on bottom of parent
 * @param {boolean} props.left If true, position on left of parent
 * @param {boolean} props.right If true, position on right of parent
 * @param {Object[]} props.controlElements Array of control elements to display
 *   Typically {type: string, content: string|Object[], value:
 *   boolean|Object|string[], action: function} Available types: header,
 *   helperText, label, select, switch, slider, comboBox, textInput,
 *   selectMulti, selectNestMulti
 * @param {string} props.iconColor Color of icon (optional)
 * @param {string} props.className Class name for styling (optional)
 * @component
 */
function ControlsPopover({
    size = 2,
    inline = false,
    controlElements = [],
    top,
    bottom,
    left,
    right,
    iconColor,
    className,
}) {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const id = !!anchorEl ? 'simple-popover' : undefined

    return (
        <PopoverContainer
            size={size}
            inline={inline}
            className={className}
            top={top}
            bottom={bottom}
            left={left}
            right={right}
            color={iconColor || colors.yellow}
        >
            <button
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                title="Open Settings"
            >
                <Icon symbol="settings" />
            </button>
            <Popover
                id={id}
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                style={{
                    padding: '1em',
                    overflow: 'hidden',
                }}
            >
                <PopoverContent>
                    {controlElements.map((elementProps, idx) => {
                        if (ControlElementMapping[elementProps.type]) {
                            const El = ControlElementMapping[elementProps.type]
                            return <El key={idx} {...elementProps} />
                        } else {
                            return null
                        }
                    })}
                </PopoverContent>
                {!!anchorEl && (
                    <CloseButton onClick={handleClose} title="Close Panel">
                        ×
                    </CloseButton>
                )}
            </Popover>
        </PopoverContainer>
    )
}
export default ControlsPopover
