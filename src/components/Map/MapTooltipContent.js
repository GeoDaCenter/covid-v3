import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { HoverDiv } from "../../components";
import useGetTooltipContent from "../../hooks/useGetTooltipContent";
import { hasProps } from "../../utils";
import styled from "styled-components";
// This component handles and formats the map tooltip info.
// The props passed to this component should contain an object of the hovered object (from deck, info.object by default)

const TooltipInnerDiv = styled.div`
  padding:.5em;
`

const ChoroplethTooltip = ({ tooltipContent }) => {
  return (
    <TooltipInnerDiv>
      {"name" in tooltipContent && (
        <>
          <h3>{tooltipContent.name}</h3>
          <hr />
        </>
      )}
      {hasProps(tooltipContent, [
        "population",
        "vaccines_fully_vaccinated",
      ]) && (
          <>
            Fully Vaccinated:{" "}
            {Math.round(
              (tooltipContent.vaccines_fully_vaccinated /
                tooltipContent.population) *
              1000
            ) / 10}
            %<br />
          </>
        )}
      {hasProps(tooltipContent, ["population", "vaccines_one_dose"]) && (
        <>
          {" "}
          At least one dose:{" "}
          {Math.round(
            (tooltipContent.vaccines_one_dose / tooltipContent.population) *
            1000
          ) / 10}
          %<br />
          <br />
        </>
      )}
      {hasProps(tooltipContent, ["cases", "daily_cases"]) && (
        <>
          Cases: {(tooltipContent.cases || 0).toLocaleString("en") || 0}
          <br />
          Daily New Cases:{" "}
          {(tooltipContent.daily_cases || 0).toLocaleString("en") || 0}
          <br />
        </>
      )}
      {hasProps(tooltipContent, ["deaths", "daily_deaths"]) && (
        <>
          Deaths: {(tooltipContent.deaths || 0).toLocaleString("en") || 0}
          <br />
          Daily New Deaths:{" "}
          {(tooltipContent.daily_deaths || 0).toLocaleString("en") || 0}
          <br />
        </>
      )}

      {"testing_wk_pos" in tooltipContent && (
        <>
          7-Day Average Positivity Rate:
          {Math.round(tooltipContent?.testing_wk_pos * 10000) / 100 || 0}
          %<br />
        </>
      )}
      {"testing_tcap" in tooltipContent && (
        <>
          7-Day Average Tests Performed:
          {tooltipContent.testing_tcap?.toLocaleString("en") || 0} per 100k
          <br />
        </>
      )}
    </TooltipInnerDiv>
  );
};
const HospitalTooltip = ({ data }) => {
  return (
    <TooltipInnerDiv>
      <h3>{data["Name"]}</h3>
      <hr />
      {data["Hospital Type"]}
      <br />
      {data.Address} <br />
      {data.Address_2 && `${data.Address_2}${(<br />)}`}
      {data.City}, {data.State}
      <br />
      {data.Zipcode}
      <br />
    </TooltipInnerDiv>
  );
};
const VaccinationSiteTooltip = ({ data }) => {
  return (
    <TooltipInnerDiv>
      <h3>{data.name}</h3>
      {data.type === 0 && (
        <>
          <b>Invited</b> vaccination clinic
        </>
      )}
      {data.type === 1 && <>Participating vaccination clinic</>}
      {data.type === 3 && <>Large scale vaccination site</>}
      <hr />
      {data.address}
      <br />
      {data.phone && (
        <>
          <br />
          {data.phone}
          <br />
        </>
      )}
      {data.volumne && (
        <>
          <br />
          <br />
          Expected Vaccination Volume: {data.volume}/day
          <br />
          <br />
        </>
      )}
      {data.description && (
        <>
          <br />
          {data.description}
          <br />
          <br />
        </>
      )}
    </TooltipInnerDiv>
  );
};

const FQHCTooltip = ({ data }) => {
  return (
    <TooltipInnerDiv>
      <h3>{data.name}</h3>
      <hr />
      {data.address}
      <br />
      {data.city},{data.st_abbr} <br />
      {data.phone}
      <br />
      <br />
      {data.testing_status === "Yes"
        ? "This location offers COVID-19 testing."
        : "Currently, this location does not offer COVID-19 testing."}
      <br />
    </TooltipInnerDiv>
  );
};
const CustomTooltip = ({ data }) => {
  if (!data) return null
  return (
    <TooltipInnerDiv>
      {Object.entries(data)
        .filter(e => e[0] !== 'custom')
        .map((entry) => (
          <>
            <b>{entry[0]}:</b>{" "}
            {typeof entry[1] !== "object" ? entry[1] : JSON.stringify(entry[1])}
            <br />
          </>
        ))}
    </TooltipInnerDiv>
  );
};

const TooltipEngine = ({ data, tooltipContent, custom }) => {
  if (data && custom) {
    return <CustomTooltip data={data} />;
  } else if (!data && custom) {
    return null
  }

  if (data && "Hospital Type" in data) {
    return <HospitalTooltip data={data} />;
  }

  if (data && "testing_status" in data) {
    return <FQHCTooltip data={data} />;
  }

  if (data && "type" in data) {
    return <VaccinationSiteTooltip data={data} />;
  }


  if ("name" in tooltipContent) {
    return <ChoroplethTooltip tooltipContent={tooltipContent} />;
  }

  return null;
};

export default function MapTooltipContent() {
  const { x, y, data, geoid } = useSelector(({ ui }) => ui.tooltipInfo) || {};
  const tooltipContent = useGetTooltipContent({ data, geoid });
  const currentData = useSelector(({ params }) => params.currentData);
  const tooltipText = useMemo(
    () => <TooltipEngine tooltipContent={tooltipContent} data={data} custom={currentData.includes('customdata')} />,
    [JSON.stringify({ tooltipContent, data })]
  );
  if (!tooltipContent || !Object.keys(tooltipContent).length || typeof window === "undefined") return null;

  const horizontalProp = window && window.innerWidth - x < 200
    ? { right: `calc(100% - ${x}px)` }
    : { left: x }
  const verticalProp = window && window.innerHeight - y < 200
    ? { bottom: `calc(100% - ${y}px)` }
    : { top: y }

  return (
    <ErrorBoundary>
      <HoverDiv
        style={{
          position: "fixed",
          pointerEvents: "none",
          ...verticalProp,
          ...horizontalProp
        }}
      >
        {tooltipText}
      </HoverDiv>
    </ErrorBoundary>
  );
}
