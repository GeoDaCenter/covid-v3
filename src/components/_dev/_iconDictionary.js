import React from "react";
import Icon from "../Interface/Icon";
import * as SVG from '../../config/svg';
import styled from "styled-components";
import { Grid } from "@mui/material";

const IconDictContainer = styled.div`
    background:white;
    max-width:1024px;
    width: 80vw;
    margin:10rem auto;
    padding:1rem;
    h1 {
        padding-bottom:2rem;
    }
`

const IconContainer = styled(Grid)`
    padding:.5rem;
    margin:.5rem;
    border:1px solid black;
    text-align: center;
    svg {
        max-width: 4rem;
        max-height: 4rem;
    }
    &#settings {
        .cls-1 {
            stroke: black;
            stroke-width: 6px;
        }
    }
`

export default function IconDict(){
    return <IconDictContainer>
        <h1>Icon Dictionary</h1>
        <p>Available via</p>
        <code>
            import Icon from '../Interface/Icon';
            <br/>
            ...
            <br/>
            {`<Icon symbol="settings" />`}
            <br/>
            <br/>
        </code>
        <Grid container spacing={2}>
        {Object.keys(SVG).sort().map(key => (
            <IconContainer xs={3} md={2} lg={1} id={key}>
                <Icon key={key} symbol={key} />
                <p>{key}</p>
            </IconContainer>
        ))}
        </Grid>
    </IconDictContainer>
}