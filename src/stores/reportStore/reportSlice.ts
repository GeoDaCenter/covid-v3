import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MetaSpec, ReportItem, ReportState } from './types'
// @ts-ignore
import DEFAULTS from './reportInitialState'
import { nanoid } from 'nanoid'
// @ts-ignore
import { generateReportLayout } from './utils'
const initialState = DEFAULTS as ReportState

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    addNewReport(
      state,
      action: PayloadAction<{ reportName: string; spec: string; meta: MetaSpec }>
    ) {
      const { reportName, spec, meta } = action.payload
      const { items, layout } = generateReportLayout(spec)
      state.reports[reportName] = {
        meta,
        items,
        layout,
        defaults: action.payload,
      }
      state.pageIdx = 0
      state.currentReport = reportName
    },
    resetReport(state, action: PayloadAction<{ reportName: string }>) {
      const { reportName } = action.payload
      const { defaults } = state.reports[reportName]
      const { items, layout } = generateReportLayout(defaults.spec)
      state.reports[reportName] = {
        ...state.reports[reportName],
        items,
        layout,
      }
    },
    setCurrentReport: (state, action: PayloadAction<string>) => {
      const currentReport = action.payload
      state.currentReport = currentReport
      state.pageIdx = 0

      state.loadState = {
        items: {},
        isLoaded: state.reports[currentReport]?.layout?.[0]?.length === 0,
      }
    },
    changeReportItem(
      state,
      action: PayloadAction<{ reportName: string; itemId: string; props: any }>
    ) {
      const { reportName, itemId, props } = action.payload
      state.reports[reportName].items[itemId] = {
        ...state.reports[reportName].items[itemId],
        ...props,
      }
    },
    updateReportLayout(
      state,
      action: PayloadAction<{
        reportName: string
        layout: any
        pageIdx: number
      }>
    ) {
      const { reportName, pageIdx, layout } = action.payload
      if (
        !state.reports[reportName] ||
        !state.reports[reportName]?.layout?.[pageIdx]
      )
        return
      // @ts-ignore
      const isInvalidLayout = layout.find((item) => item.y + item.h >= 70)
      state.error = isInvalidLayout
        ? {
            type: 'Invalid layout',
            pageIdx,
            reportName,
          }
        : null
      state.reports[reportName].layout[pageIdx] = layout
    },
    addReportItem(
      state,
      action: PayloadAction<{ reportName: string; pageIdx: number; item: any }>
    ) {
      const { reportName, pageIdx, item } = action.payload
      const key = nanoid()
      state.reports[reportName].items[key] = {
        ...item,
        key
      }
      const w = item.w || 1
      const x = state.reports?.[reportName]?.layout?.[pageIdx].reduce(
        (prev, curr) => (prev > curr.x + curr.w ? prev : curr.x + curr.w),
        0
      )
      const h = item.h || 1
      const y = state.reports?.[reportName]?.layout?.[pageIdx].reduce(
        (prev, curr) => (prev > curr.y + curr.h ? prev : curr.y + curr.h),
        0
      )
      state.reports?.[reportName]?.layout[pageIdx].push({w,h,x,y,i: key})
    },
    deleteReportItem(
      state,
      action: PayloadAction<{
        reportName: string
        pageIdx: number
        itemId: string
      }>
    ) {
      const { reportName, pageIdx, itemId } = action.payload
      let report = state.reports[reportName]
      if (!report) return
      // remove from layout
      report.layout[pageIdx] = report.layout[pageIdx].filter(
        (item) => item.i !== itemId
      )
      // remove from dict
      delete report.items[itemId]
    },
    toggleReportItem(
      state,
      action: PayloadAction<{
        reportName: string
        itemId: string
        prop: keyof ReportItem
      }>
    ) {
      const { reportName, itemId, prop } = action.payload
      let report = state.reports[reportName]
      if (!report || !report?.items?.[itemId]) return
      // @ts-ignore
      report.items[itemId][prop] = !report.items[itemId][prop]
    },
    // reorderReportItems(
    //   state,
    //   action: PayloadAction<{
    //     reportName: string
    //     pageIdx: number
    //     itemsMin: number
    //     currItemsOrder: any[]
    //   }>
    // ) {
    //   const { reportName, pageIdx, itemsMin, currItemsOrder } = action.payload
    //   let report = state.reports[reportName]
    //   if (!report || !report?.items) return state
    //   let spec = state.reports[reportName].spec
    //   spec[pageIdx] = currItemsOrder.map((idx) => spec[pageIdx][idx - itemsMin])
    //   const reports = {
    //     ...state.reports,
    //     [reportName]: {
    //       ...state.reports[reportName],
    //       spec,
    //     },
    //   }
    //   return {
    //     ...state,
    //     reports,
    //   }
    // },
    addReportPage(state, action: PayloadAction<string>) {
      const reportName = action.payload
      if (!state.reports?.[reportName]?.layout) return
      state.reports?.[reportName]?.layout.push([])
      state.pageIdx = state.reports?.[reportName]?.layout.length - 1
    },
    clearError(state) {
      state.error = null
    },
    setReportPage(state, action: PayloadAction<number>) {
      state.pageIdx = action.payload
      state.loadState = {
        items: {},
        isLoaded:
        // @ts-ignore
          state.reports[state.currentReport]?.layout?.[action.payload]
            ?.length === 0,
      }
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      const reportName = action.payload
      delete state.reports[reportName]
    },
    setItemLoaded(
      state,
      action: PayloadAction<{ itemId: string; isLoaded: boolean }>
    ) {
      const { itemId, isLoaded } = action.payload
      state.loadState.items[itemId] = isLoaded
      // @ts-ignore
      state.loadState.isLoaded = state.reports[state.currentReport]?.layout?.[
        state.pageIdx
      ]?.every((item: { i: number }) => state.loadState.items[item.i])
    },
    setPrintingState(
      state,
      action: PayloadAction<{ fileType: string; status: boolean }>
    ) {
      const { fileType, status } = action.payload
      state.printStatus = status
      state.printFileType = fileType
    },
  },
})

// Action creators are generated for each case reducer function
export const reportActions = reportSlice.actions
export default reportSlice.reducer

interface ReportStateOuter {
  report: ReportState
}
export const reportSelectors = {
  selectAllReports: (state: ReportStateOuter) => state.report,
  selectReportNames: (state: ReportStateOuter) => Object.keys(state.report.reports),
  selectReport: (reportName: string) => (state: ReportStateOuter) => state.report.reports[reportName],
  selectReportMeta: (reportName: string) => (state: ReportStateOuter) => state.report.reports?.[reportName]?.meta,
  selectItem: (reportName: string, itemId: string) => (state: ReportStateOuter) => state.report.reports?.[reportName]?.items?.[itemId],
  selectCurrentPage: (state: ReportStateOuter) => state.report.pageIdx,
  selectCurrentReport: (state: ReportStateOuter) => state.report.currentReport,
  selectcurrentReportLength: (state: ReportStateOuter) => state.report.reports?.[state.report.currentReport!]?.layout?.length,
  selectPrintStatus: (state: ReportStateOuter) => state.report.printStatus,
  selectPrintFileType: (state: ReportStateOuter) => state.report.printFileType,
  selectReportError: (state: ReportStateOuter) => state.report.error,
  selectLoadState: (state: ReportStateOuter) => state.report.loadState,
  selectIsLoaded: (state: ReportStateOuter) => state.report.loadState.isLoaded,
}
