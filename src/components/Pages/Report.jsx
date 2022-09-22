import React from "react";
import styled from "styled-components";
import { NavBar, Footer, ContentContainer } from "../../components";
import colors from "../../config/colors";
import ReportBuilder from "../../components/Panels/ReportBuilder/ReportBuilder";

const ReportPage = styled.div`
  background: ${colors.darkgray};
  .reportContainer {    
    p, .MuiButton-root {
        color: white !important;
    }
  }
`;

export default function Report() {
    return (
        <ReportPage>
            <NavBar light />
            <ContentContainer>
                <div className="reportContainer">
                    <ReportBuilder isPage={true} />
                </div>
            </ContentContainer>
            <Footer />
        </ReportPage>
    );
}
