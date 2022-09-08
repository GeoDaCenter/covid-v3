import { ControlPopover, MetricsTable } from "../../../../components";
import {
  PanelItemContainer,
  GrabTarget,
  DeleteBlock,
  widthOptions,
  heightOptions,
} from "./PageComponentsLayout";
// import {
//   onlyUniqueArray,
//   removeListItem
// } from '../../../../utils';
import colors from "../../../../config/colors";
import countyNames from "../../../../meta/countyNames";
// import { matchAndReplaceInlineVars } from "../../../../utils";
import {
  ALL_COLUMNS,
  DEFAULT_COLUMNS,
  DEFAULT_METRICS,
  COLUMN_MAPPINGS,
  CommunityContextMetrics,
  CovidMetrics,
  CovidVarMapping,
} from "./constants";
import { useLayoutEffect } from "react";
export const TableReport = ({
  geoid = null,
  pageIdx = 0,
  contentIdx = 0,
  handleChange,
  handleRemove,
  width = 2,
  height = 3,
  topic = "COVID",
  metrics = [],
  includedColumns = DEFAULT_COLUMNS,
  neighbors,
  secondOrderNeighbors,
  geogToInclude = "county",
  dateIndex,
  name,
  metaDict = {},
  loadedCallback = () => {},
}) => {
  const neighborIds = {
    county: geoid,
    neighbors,
    secondOrderNeighbors,
    national: null,
  }[geogToInclude];
  const variableNames =
    topic === "COVID"
      ? metrics.map((metric) => CovidVarMapping[metric]).flat()
      : metrics;
  const parsedColumns = includedColumns.map((f) => COLUMN_MAPPINGS[f]);

  useLayoutEffect(() => {
    loadedCallback(true);
  }, []);

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
          neighborIds,
          dateIndex,
          name,
        }}
      />
      <ControlPopover
        top="0"
        left="0"
        className="hover-buttons"
        iconColor={colors.strongOrange}
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
            type: "selectMulti",
            content: {
              label: "Add or Remove Statistics",
              items: ALL_COLUMNS,
            },
            action: (e) => handleChange({ includedColumns: e.target.value }),
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
        onClick={() => handleRemove(pageIdx, contentIdx)}
      />
    </PanelItemContainer>
  );
};
