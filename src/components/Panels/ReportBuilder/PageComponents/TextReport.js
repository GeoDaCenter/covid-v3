import { useLayoutEffect } from "react";
import { ControlPopover, TextStatistics } from "../../../../components";
import {
  PanelItemContainer,
  GrabTarget,
  DeleteBlock,
} from "./PageComponentsLayout";
import colors from "../../../../config/colors";
import countyNames from "../../../../meta/countyNames";
import { HoverButtonsContainer } from "../InterfaceComponents/HoverButtonsContainer";

export const TextReport = ({
  geoid = null,
  pageIdx = 0,
  contentIdx = 0,
  handleChange,
  handleRemove,
  format = "bullet",
  dateIndex,
  loadedCallback,
}) => {
  useLayoutEffect(() => {
    loadedCallback(true);
  }, []);
  return (
    <PanelItemContainer>
      <TextStatistics {...{ geoid, format, dateIndex }} />
      <HoverButtonsContainer>
        <ControlPopover
          className="hover-buttons"
          inline
          size={4}
          iconColor={colors.strongOrange}
          controlElements={[
            {
              type: "header",
              content: "Controls for Text Report Block",
            },
            {
              type: "helperText",
              content: "Select the data to display on the chart.",
            },
            {
              type: "select",
              content: {
                label: "Change County",
                items: countyNames,
              },
              action: (e) => handleChange({ geoid: e.target.value }),
              value: geoid,
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
      </HoverButtonsContainer>
    </PanelItemContainer>
  );
};