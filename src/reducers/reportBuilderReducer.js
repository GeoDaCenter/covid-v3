import INITIAL_STATE from "../constants/reportBuilderState";
import { templates } from "../components/Panels/ReportBuilder/Report/Templates";

function generateTypeKey(
  stringifiedKeys,
  type
) {
  if (!(stringifiedKeys.includes(type))) {
    return `${type}-0`
  } else {
    let i=1;
    do {
      const tempName = `${type}-${i}`
      if (!(stringifiedKeys.includes(tempName))) {
        return tempName
      }
    } while (i < 1000) //artibtrary cut off to prevent infinite loops
  }
  return null
}

function generateReportLayout(spec) {
  const template = templates[spec]
  let items = {};
  let layout = template.map(_ => []);
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < template[i].length; j++) {
      const keys = [...Object.keys(items)].reverse();
      const stringifiedKeys = keys.join(' ')
      const currItem = template[i][j];
      const {
        type,
        w,
        h,
        x,
        y
      } = currItem
      const key = generateTypeKey(stringifiedKeys, type)
      items[key] = {
        ...currItem,
        key
      }
      layout[i].push({
        w: w||1,
        h: h||1,
        x: x||0,
        y: y||0,
        i: key
      })

    }
  }
  
  return {
    items,
    layout
  }
}


export default function Reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ADD_NEW_REPORT": {
      const { reportName, spec, meta } = action.payload;
      const { items, layout } = generateReportLayout(spec)
      
      const reports = {
        ...state.reports,
        [reportName]: {
          meta,
          items, 
          layout,
          defaults: action.payload
        },
      }
      return {
        reports
      }
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
    case "CHANGE_REPORT_ITEM": {
      const { reportName, itemId, props } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items?.[itemId]) return state;
      report.items[itemId] = {
        ...report.items[itemId],
        ...props,
      }

      return {
        reports: {
          ...state.reports,
          [reportName]: report
        }
      };
    }
    case "ADD_REPORT_ITEM": {
      const { reportName, pageIdx, item } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items) return state;
      const keys = [...Object.keys(report.items)].reverse();
      const stringifiedKeys = keys.join(' ')
      const key = generateTypeKey(stringifiedKeys, item.type)
      report.items[key] = {
        ...item,
        key
      }
      const w = item.w || 1
      const x = report.layout[pageIdx].reduce(
        (prev, curr) => prev > curr.x + curr.w ? prev : curr.x + curr.w, 0
      ) 
      const h = item.h || 1
      const y = report.layout[pageIdx].reduce(
        (prev, curr) => prev >  curr.y + curr.h ? prev : curr.y + curr.h, 0
      ) 
      report.layout[pageIdx].push({
        w,
        h,
        x,
        y,
        i: key
      })
      return {
        reports: {
          ...state.reports,
          [reportName]: report
        }
      };
    }
    case "DELETE_REPORT_ITEM": {
      const { reportName, pageIdx, itemId } = action.payload;
      let report = state.reports[reportName];
      if (!report) return state;
      // remove from layout
      report.layout[pageIdx] = report.layout[pageIdx].filter(item => item.i !== itemId);
      // remove from dict
      delete report.items[itemId];

      return {
        reports: {
          ...state.reports,
          [reportName]: report
        }
      };
    }
    case "TOGGLE_REPORT_ITEM": {
      const { reportName, itemId, prop } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items?.[itemId]) return state;
      report.items[itemId][prop] = !report.items[itemId][prop];

      return {
        reports: {
          ...state.reports,
          [reportName]: report
        }
      };
    }
    case "REORDER_REPORT_ITEMS": {
      const { reportName, pageIdx, itemsMin, currItemsOrder } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.items?.[itemId]) return state;
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
        reports
      }
    }
    case "ADD_REPORT_PAGE": {
      const { reportName } = action.payload;
      let report = state.reports[reportName];
      if (!report || !report?.layout) return state;
      report.layout.push([])

      return {
        reports: {
          ...state.reports,
          [reportName]: report
        }
      };
    }
    // case "DELETE_REPORT": {
    //   let reports = { ...state.reports };
    //   delete reports[action.payload];
    //   return {
    //     reports
    //   }
    // }
    default:
      return state;
  }
}
