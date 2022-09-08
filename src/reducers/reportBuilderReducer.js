import INITIAL_STATE from "../constants/reportBuilderState";
import { templates } from "../components/Panels/ReportBuilder/Report/Templates";
import { nanoid } from "nanoid";

export default function Reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ADD_NEW_REPORT": {
      const { reportName, spec, meta } = action.payload;
      const { items, layout } = generateReportLayout(spec);

      const reports = {
        ...state.reports,
        [reportName]: {
          meta,
          items,
          layout,
          defaults: action.payload,
        },
      };
      return {
        ...state,
        reports,
        pageIdx: 0,
        currentReport: reportName
      };
    }
    // case "RESET_REPORT": {
    //   const { reportName } = action.payload;
    //   const prev = state.reports[reportName];
    //   const reports = {
    //     ...state.reports,
    //     [reportName]: {
    //       ...prev,
    //       spec: templates[prev.defaultTemplate],
    //     },
    //   }
    //   return {
    //     reports
    //   };
    // }
    case "SET_CURRENT_REPORT": {
      const currentReport = action.payload;
      const {reports} = state;
      const pageIsEmpty = reports[currentReport]?.layout?.[0]?.length === 0;

      return {
        ...state,
        currentReport,
        pageIdx: 0,
        loadState: {
          items: {},
          isLoaded: pageIsEmpty
        }
      };
    }
    case "CHANGE_REPORT_ITEM": {
      const { reportName, itemId, props } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items?.[itemId]) return state;
      report.items[itemId] = {
        ...report.items[itemId],
        ...props,
      };
      return {
        ...state,
        reports: {
          ...state.reports,
          [reportName]: report,
        }
      };
    }
    case "UPDATE_REPORT_LAYOUT": {
      const { reportName, pageIdx, layout } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.layout?.[pageIdx]) return state;
      const isInvalidLayout = layout.find((item) => item.y + item.h >= 70);
      const error = isInvalidLayout
        ? {
            type: "Invalid layout",
            pageIdx,
            reportName,
          }
        : null;
      report.layout[pageIdx] = layout;
      // console.log(cleanLayout({
      //   [reportName]: report
      // }))
      return {
        ...state,
        error,
        reports: {
          ...state.reports,
          [reportName]: report,
        }
      };
    }
    case "ADD_REPORT_ITEM": {
      const { reportName, pageIdx, item } = action.payload;
      let report = {
        ...state.reports[reportName],
      };
      if (!report || !report?.items) return state;
      const key = nanoid();
      report.items[key] = {
        ...item,
        key,
      };
      const w = item.w || 1;
      const x = report.layout[pageIdx].reduce(
        (prev, curr) => (prev > curr.x + curr.w ? prev : curr.x + curr.w),
        0
      );
      const h = item.h || 1;
      const y = report.layout[pageIdx].reduce(
        (prev, curr) => (prev > curr.y + curr.h ? prev : curr.y + curr.h),
        0
      );
      report.layout[pageIdx].push({
        w,
        h,
        x,
        y,
        i: key,
      });
      return {
        ...state,
        reports: {
          ...state.reports,
          [reportName]: report,
        }
      };
    }
    case "DELETE_REPORT_ITEM": {
      const { reportName, pageIdx, itemId } = action.payload;
      let report = state.reports[reportName];
      if (!report) return state;
      // remove from layout
      report.layout[pageIdx] = report.layout[pageIdx].filter(
        (item) => item.i !== itemId
      );
      // remove from dict
      delete report.items[itemId];

      return {
        ...state,
        reports: {
          ...state.reports,
          [reportName]: report,
        },
      };
    }
    case "TOGGLE_REPORT_ITEM": {
      const { reportName, itemId, prop } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items?.[itemId]) return state;
      report.items[itemId][prop] = !report.items[itemId][prop];

      return {
        ...state,
        reports: {
          ...state.reports,
          [reportName]: report,
        },
      };
    }
    case "REORDER_REPORT_ITEMS": {
      const { reportName, pageIdx, itemsMin, currItemsOrder } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items) return state;
      let spec = state.reports[reportName].spec;
      spec[pageIdx] = currItemsOrder.map(
        (idx) => spec[pageIdx][idx - itemsMin]
      );
      const reports = {
        ...state.reports,
        [reportName]: {
          ...state.reports[reportName],
          spec,
        },
      };
      return {
        ...state,
        reports,
      };
    }
    case "ADD_REPORT_PAGE": {
      const { reportName } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.layout) return state;
      report.layout.push([]);

      return {
        ...state,
        reports: {
          ...state.reports,
          [reportName]: report,
        },
        pageIdx: report.layout.length - 1,
      };
    }
    case "CLEAR_ERROR": {
      return {
        ...state,
        error: null,
        reports: {
          ...state.reports,
        }
      };
    }
    case "SET_PAGE_IDX": {
      // if no items, default to loaded state, otherwise child components will update state
      const {reports, currentReport} = state;
      const pageIdx = action.payload
      const pageIsEmpty = reports[currentReport]?.layout?.[pageIdx]?.length === 0;

      return {
        ...state,
        loadState: {
          items: {},
          isLoaded: pageIsEmpty
        },
        pageIdx
      };
    }
    // case "DELETE_REPORT": {
    //   let reports = { ...state.reports };
    //   delete reports[action.payload];
    //   return {
    //     reports
    //   }
    // }
    case "SET_ITEM_LOADED": {
      const {id, isLoaded} = action.payload;
      let items = {
        ...state.loadState.items,
        [id]: isLoaded
      }
      const {reports, pageIdx, currentReport} = state;
      const pageIsLoaded = reports[currentReport]?.layout?.[pageIdx]?.every(
        (item) => items[item.i]
      )
      return {
        ...state,
        loadState: {
          items,
          isLoaded: pageIsLoaded
        }
      }
    }
    default:
      return state;
  }
}

function generateReportLayout(spec) {
  const template = templates[spec];
  let items = {};
  let layout = template.map((_) => []);
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      // const keys = [...Object.keys(items)].reverse();
      // const stringifiedKeys = keys.join(" ");
      const currItem = template[i][j];
      const { w, h, x, y } = currItem; //type
      const key = nanoid();
      items[key] = {
        ...currItem,
        key,
      };
      layout[i].push({
        w: w || 10,
        h: h || 10,
        x: x || 0,
        y: y || 0,
        i: key,
      });
    }
  }

  return {
    items,
    layout,
  };
}

// function cleanLayout(spec){
//   const removeProps = ['moved','static','i','key']
//   const {layout, items} = spec[Object.keys(spec)[0]];
//   let template = []
//   for (const page of layout){
//     let pageItems = []
//     for (const item of page){
//       let tempItem = {
//         ...items[item.i],
//         ...item,
//       }
//       removeProps.forEach(prop => delete tempItem[prop])
//       pageItems.push(tempItem)
//     }
//     template.push(pageItems)
//   }
//   return template
// }

// function generateTypeKey(stringifiedKeys, type) {
//   if (!stringifiedKeys.includes(type)) {
//     return `${type}-0`;
//   } else {
//     let i = 1;
//     do {
//       const tempName = `${type}-${i}`;
//       if (!stringifiedKeys.includes(tempName)) {
//         return tempName;
//       }
//     } while (i < 1000); //artibtrary cut off to prevent infinite loops
//   }
//   return null;
// }