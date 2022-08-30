import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import styled from "styled-components";
import { ControlElementMapping, Gutter, Icon } from "../../../components";
import colors from "../../../config/colors";
const Selector = ControlElementMapping["select"];
const TemplateButton = styled.button`
  background: none;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  padding: 0 1em 2em 1em;
  max-width: min(10em, 100%);
  margin: 1em;
  display: inline-block;
  cursor: pointer;
  transition: 250ms all;
  flex:0 0 auto;
  box-sizing:border-box;
  svg {
    transition: 250ms all;
    fill: ${colors.white};
    width: 100%;
    padding: 20%;
    aspect-ratio: 1;
  }
  &:hover,
  &.selected {
    border-color: ${colors.yellow};
    color: ${colors.yellow};
    svg {
      fill: ${colors.yellow};
    }
  }
  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
    max-height: 20vh;
    margin:.5em 0;
    
    svg {
      /* height:100%; */
      max-width: 10vw;
      width: initial;
      padding:0;
      aspect-ratio: initial;
    }
  }
`;

const TemplatesContainer = styled.div`
  display: flex;
  align-content:center;
  flex-wrap: wrap;
  flex-direction:row;


`

const CustomizerCointainer = styled.div`
  flex:1 1 auto;
  padding: 0;
  h3 {
    display:block;
    margin:.5em 0 .5em 0;
  }
`
const InputContainer = styled.div`
  display:flex;
  flex-direction:column;
  margin-bottom:1em;
`

function TemplateCustomzier({ template = {} }) {
  if (!template?.customization || !template.customization.length) return null;
  return <CustomizerCointainer>
  {template.customization.map(({label, input}, index) => {
    const InnerElement = ControlElementMapping[input.type];
    return <InputContainer key={`${index}-${input.type}`}>
    <h3>{label}</h3>
      <InnerElement {...input} />
    </InputContainer>
  })}
  </CustomizerCointainer>

}

export default function TemplateSelector({
  selectedTemplate = "",
  setSelectedTemplate = () => {},
  templates = [],
  showTemplateCustomizer = false,
  previousReport = false,
  setPreviousReport = () => {}
}) {
  const reports = useSelector(({ report }) => report.reports);
  const previousReports = Object.keys(reports||{})||[]
  
  const templatesToShow = !showTemplateCustomizer
    ? templates
    : templates.filter((t) => t.label === selectedTemplate);
  return (
    <TemplatesContainer>
      {templatesToShow.map(({ icon, label }, idx) => (
          <TemplateButton
            onClick={() => {
              setSelectedTemplate(label)
              setPreviousReport(false)
            }}
            className={selectedTemplate === label ? "selected" : ""}
          >
            {icon ? <Icon symbol={icon} /> : <Gutter h={25} />}
            {label}
          </TemplateButton>
      ))}
      
      {!!previousReports?.length && !showTemplateCustomizer && 
        <Selector 
          content={{items: previousReports.map(f=>({label:f, value:f})), label: "Previous Reports"}}
          value={previousReport}
          action={(e) => {
            setPreviousReport(e.target.value)
            setSelectedTemplate("")
          }}
          acitve={previousReport !== false}
        />
        }
        {!!previousReport && !!showTemplateCustomizer && 
        <Grid item xs={12} md={12}>
          <h3>Click next to keep working on your report {previousReport}</h3>
          </Grid>}
      {showTemplateCustomizer && (
          <TemplateCustomzier template={templatesToShow[0]} />
      )}
    </TemplatesContainer>
  );
}
