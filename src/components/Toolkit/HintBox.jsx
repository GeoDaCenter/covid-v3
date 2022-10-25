import React from 'react'
import styled from 'styled-components'
import colors from '../../config/colors'
import Icon from '../Interface/Icon'

const Container = styled.div`
    display: flex;
    border: 2px solid ${colors.teal};
    border-radius: 0.25em;
    background: ${colors.teal}22;
    padding: 1em;
    margin: 1em 0;
    align-items: center;
    p {
        margin: 0;
    }

    span {
        width: 10em;
        min-width: 60px;
        aspect-ratio: 1;
        margin-top: 0;
        padding: 0;
        transform: translateY(-25%);
    }
    svg {
        width: 100% !important;
        height: 100% !important;
    }
    @media (max-width: 1024px) {
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
`

/**
 * MDX component for displaying a hint box
 *
 * @category Components/Layout
 * @param {Object} props
 * @param {string} props.icon - The name of the icon to display
 * @param {React.ReactNode} props.children - The content of the hint box
 * @component
 */
function HintBox({ children, icon = 'lightbulb' }) {
    return (
        <Container>
            <Icon symbol={icon} />
            <p>{children}</p>
        </Container>
    )
}

export default HintBox
