import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { HoverDiv } from "../../components";
import useGetTooltipContent from "../../hooks/useGetTooltipContent";
import { hasProps } from "../../utils";
// This component handles and formats the map tooltip info.
// The props passed to this component should contain an object of the hovered object (from deck, info.object by default)

const ChoroplethTooltip = ({ tooltipContent }) => {
  return (
    <>
      {"name" in tooltipContent && (
        <>
          <h3>{tooltipContent.name}</h3>
          <hr />
        </>
      )}
      {hasProps(tooltipContent, [
        "population",
        "vaccines_fully_vaccinated",
        "vaccines_one_dose",
      ]) && (
        <>
          Fully Vaccinated:{" "}
          {Math.round(
            (tooltipContent.vaccines_fully_vaccinated /
              tooltipContent.population) *
            1000
          ) / 10}
          %<br />
          At least one dose:{" "}
          {Math.round(
            (tooltipContent.vaccines_one_dose /
              tooltipContent.population) *
            1000
          ) / 10}
          %<br />
          <br />
        </>
      )}
      {hasProps(tooltipContent, [
        "cases",
        "daily_cases",
        "deaths",
        "daily_deaths",
      ]) && (
        <>
          Cases: {(tooltipContent.cases || 0).toLocaleString("en") || 0}
          <br />
          Deaths: {(tooltipContent.deaths || 0).toLocaleString("en") || 0}
          <br />
          Daily New Cases:{" "}
          {(tooltipContent.daily_cases || 0).toLocaleString("en") || 0}
          <br />
          Daily New Deaths:{" "}
          {(tooltipContent.daily_deaths || 0).toLocaleString("en") || 0}
          <br />
          <br />
        </>
      )}
      {"testing_wk_pos" in tooltipContent && (
        <>
          7-Day Average Positivity Rate:
          {Math.round(tooltipContent?.testing_wk_pos * 10000) /
            100 || 0}
          %<br />
        </>
      )}
      {"testing_tcap" in tooltipContent && (
        <>
          7-Day Average Tests Performed:
          {tooltipContent.testing_tcap?.toLocaleString("en") || 0}{" "}
          per 100k
          <br />
        </>
      )}
    </>
  )
}
const HospitalTooltip = ({ data }) => {
  return (
    <>
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
    </>
  )
}
const VaccinationSiteTooltip = ({ data }) => {
  return (
    <>
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
    </>
  )
}

const FQHCTooltip = ({ data }) => {
  return (
    <>
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
    </>
  )
}
const CustomTooltip = ({ data }) => {
  return (
    <>
      {Object.entries(data.custom).map((entry) => (
        <>
          <b>{entry[0]}:</b>{" "}
          {typeof entry[1] !== "object"
            ? entry[1]
            : JSON.stringify(entry[1])}
          <br />
        </>
      ))}
    </>
  )
}

const TooltipEngine = ({
  data,
  tooltipContent
}) => {
  if (data && "Hospital Type" in data) {
    return <HospitalTooltip data={data} />
  }

  if (data && "testing_status" in data) {
    return <FQHCTooltip data={data} />
  }

  if (data && "type" in data) {
    return <VaccinationSiteTooltip data={data} />
  }

  if (data && "custom" in data) {
    return <CustomTooltip data={data} />
  }

  if ("name" in tooltipContent) {
    return <ChoroplethTooltip tooltipContent={tooltipContent} />
  }

  return null
}

export default function MapTooltipContent() {
  
  const { x, y, data, geoid } = useSelector(({ ui }) => ui.tooltipInfo) || {};
  const tooltipRef = useRef(null);
  const tooltipContent = useGetTooltipContent({ data, geoid });
  const tooltipText = useMemo(() => <TooltipEngine tooltipContent={tooltipContent} data={data} />,[JSON.stringify({tooltipContent, data})])
  if (!tooltipContent || !Object.keys(tooltipContent).length) return <></>;
  const bounds =
    tooltipRef.current && tooltipRef.current.getBoundingClientRect();
  const transposeProps = {
    transform: `translate(${bounds && window && window.innerWidth - bounds.right < 200 ? "-100%" : 0
      }, 
      ${bounds && window && window.innerHeight - bounds.bottom < 200
        ? "-100%"
        : 0
      })`,
  };
  return (
    <ErrorBoundary>
      <HoverDiv
        style={{
          position: "fixed",
          pointerEvents: "none",
          left: x,
          top: y,
          transition: "transform 0.2s ease-in-out",
          ...transposeProps,
        }}
        ref={tooltipRef}
      >
        {tooltipText}
      </HoverDiv>
    </ErrorBoundary>
  );
}
