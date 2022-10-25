import styled from 'styled-components'
import colors from '../../../config/colors'
/**
 * Styled form button. Uses default HTML button API.
 *
 * @category Components/DataLoader
 * @example
 *     function MyComponent() {
 *         return (
 *             <FormButton
 *                 color="red"
 *                 active={true}
 *                 disabled={false}
 *                 onClick={() => console.log('clicked')}
 *             >
 *                 My Button
 *             </FormButton>
 *         )
 *     }
 *
 * @param {Object} props
 * @param {string} props.color Color of the button text
 * @param {string} props.active If active, background is white, else gray
 * @param {string} props.disabled CSS disabled hint, shows no cursor and grayed
 *   out opacity
 */
export const FormButton = styled.button`
    padding: 0.5em;
    border: 1px solid ${colors.white};
    background: ${(props) => (props.active ? colors.white : colors.gray)};
    color: ${(props) => (props.active ? colors.gray : colors.white)};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    margin: 0.5em 0.5em 0.5em 0;
    opacity: ${(props) => (props.disabled ? 0.25 : 1)};
`
