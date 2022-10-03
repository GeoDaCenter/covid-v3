import { ControlPopover, MetricsTable } from "../../..";
import {
  PanelItemContainer,
  GrabTarget,
  DeleteBlock,
} from "./PageComponentsLayout";
// import {
//   onlyUniqueArray,
//   removeListItem
// } from '../../../../utils';
import colors from "../../../../config/colors";
import countyNames from "../../../../meta/countyNames";
// import { matchAndReplaceInlineVars } from "../../../../utils";
import {
  DEFAULT_COLUMNS,
  DEFAULT_METRICS,
  COLUMN_MAPPINGS,
  CommunityContextMetrics,
  CovidMetrics,
  CovidVarMapping,
  ALL_STAT_AGGREGATIONS,
} from "./constants";
import { useLayoutEffect } from "react";
import { HoverButtonsContainer } from "../InterfaceComponents/HoverButtonsContainer";
import useGetNeighbors from "../../../../hooks/useGetNeighbors";


/**
 * Wrapper report item for a scatterp lot in the report builder. This component
 * shouldn't be called directly, but through the report spec and builder.
 *
 * @category Components/ReportBuilder
 * @param {Object} props
 * @param {number} props.geoid - geoid of the current geography
 * @param {string} props.topic - topic of the table = 'COVID' | 'SDOH'
 * @param {string[]} props.includedColumns - columns to be include Array<keyof COLUMN_MAPPINGS> see more at ReportBuilder/PageComponents/constants.js
 * @param {number} props.dateIndex Date index to use for data - days since 1/22/2020
 * @param {string} props.name Name of table
 * @param {function} props.handleChange Function to partially change a report
 *   item (props: Partial<ReportItem>) => void See Report Slice for more
 * @param {function} props.handleRemove Function to remove this report item from
 *   the report () => void
 * @param {function} props.loadedCallback Function after chart is loaded
 *   (isLoaded: boolean) => void
 *  
 */
function TableReport({
  geoid = null,
  // pageIdx = 0,
  // contentIdx = 0,
  handleChange,
  handleRemove,
  // width = 2,
  // height = 3,
  topic = "COVID",
  metrics = [],
  includedColumns = DEFAULT_COLUMNS,
  // geogToInclude = "county",
  dateIndex,
  name,
  // metaDict = {},
  loadedCallback = () => { },
}){

  const variableNames =
    topic === "COVID"
      ? metrics.map((metric) => CovidVarMapping[metric]).flat()
      : metrics;
  const parsedColumns = includedColumns.map((f) => COLUMN_MAPPINGS[f])
  
  useLayoutEffect(() => {
    loadedCallback(true);
  }, []);

  const [
    neighbors,
    secondOrderNeighbors,
    state
  ] = useGetNeighbors({
    geoid,
    currentData: "county_usfacts.geojson"
  })

  const neighborGroups = [
    {
      prefix: 'neighbor',
      ids: neighbors,
    },
    {
      prefix: 'region',
      ids: secondOrderNeighbors,
    },
    {
      prefix: 'state',
      ids: state,
    }
  ]

  return (
    <PanelItemContainer>
      <h3>
        {topic.includes("COVID")
          ? "7-Day Average Summary Statistics"
          : "Community Health Context"}
      </h3>
      <MetricsTable
        includedColumns={parsedColumns}
        {...{
          metrics: variableNames,
          geoid,
          neighborGroups,
          dateIndex,
          name,
        }}
      />
      <HoverButtonsContainer>
        <ControlPopover
          top="0"
          left="0"
          size={4}
          className="hover-buttons"
          iconColor={colors.strongOrange}
          inline
          controlElements={[
            {
              type: "header",
              content: "Controls for Table Report Block",
            },
            {
              type: "helperText",
              content: "Select the data to display on the table.",
            },

            {
              type: "comboBox",
              content: {
                label: "Search County",
                items: countyNames,
              },
              action: ({ value }) => handleChange({ geoid: value }),
              value: geoid,
            },
            {
              type: "select",
              content: {
                label: "Change Topic",
                items: [
                  {
                    label: "COVID",
                    value: "COVID",
                  },
                  {
                    label: "Community Health Context",
                    value: "SDOH",
                  },
                ],
              },
              action: (e) =>
                handleChange({
                  topic: e.target.value,
                  metrics: DEFAULT_METRICS[e.target.value],
                }),
              value: topic,
            },
            {
              type: "selectMulti",
              content: {
                label: "Add or Remove Metrics",
                items: topic === "COVID" ? CovidMetrics : CommunityContextMetrics,
              },
              action: (e) => handleChange({ metrics: e.target.value }),
              value: metrics,
            },
            {
              type: "selectNestMulti",
              // content: {
              //   label: "Add or Remove Statistics",
              //   items: ALL_COLUMNS,
              // },
              action: (column) => handleChange({
                includedColumns: includedColumns.includes(column) 
                  ? includedColumns.filter(f => f !== column) 
                  : [...includedColumns, column] 
                }),
              content: {
                label: "Select Statistics",
                items: ALL_STAT_AGGREGATIONS
              },
              value: includedColumns,
            },
            // {
            //   ...widthOptions,
            //   action: (e) =>
            //     handleChange({ width: e.target.value }),
            //   value: width,
            // },
            // {
            //   ...heightOptions,
            //   action: (e) =>
            //     handleChange({ height: e.target.value }),
            //   value: height,
            // },
          ]}
        />
        <GrabTarget iconColor={colors.strongOrange} className="hover-buttons" />

        <DeleteBlock
          iconColor={colors.strongOrange}
          className="hover-buttons"
          onClick={() => handleRemove()}
        />
      </HoverButtonsContainer>
    </PanelItemContainer>
  );
};

export {
  TableReport
}