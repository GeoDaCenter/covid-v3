import React from "react";
import styled from "styled-components";
import colors from "../../config/colors";
import Icon from "../Interface/Icon";

const Container = styled.div`
    display: flex;
    border:2px solid ${colors.teal};
    border-radius:.25em;
    background:${colors.teal}22;
    padding:1em;
    margin:1em 0;
    align-items:center;
    p {
        margin:0;
    }
    @media(max-width:600px){
        flex-direction:column;
        justify-content:center;
        text-align:center; 
    }
`

const IconContainer = styled.div`
    width:6rem;
    padding:0 1rem;
    svg {
        width:100% !important;
        height:100% !important;
    }

`

const HintBox = ({
    children,
    icon="lightbulb",
}) => {
    return (
        <Container>
            <IconContainer>
                <Icon symbol={icon} />
            </IconContainer>
            <p>{children}</p>
        </Container>
    );
}

export default HintBox;