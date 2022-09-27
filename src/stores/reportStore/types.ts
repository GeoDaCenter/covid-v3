export interface MetaSpec {
    date: string
    dateIndex: number | string
}

export interface ReportItem {
    type: string
    w: number
    h: number
    x: number
    y: number
    key: string
    // map
    variable?: string
    scale?: string
    // table
    label?: string
    topic?: string
    metrics?: string[]
    includedColumns?: string[]
    // chart
    populationNormalized?: string
    shouldShowVariants?: string
    table?: string
}
export interface ReportItemLayout {
    x: number
    y: number
    w: number
    h: number
    i: string
    moved?: boolean
    static?: boolean
}

export type ReportLayout = ReportItemLayout[][]

export interface ReportDefaults {
    reportName: string
    spec: string
    meta: MetaSpec
}
export interface Report {
    meta: MetaSpec
    items: {
        [key: string]: ReportItem
    }
    layout: ReportLayout
    defaults: ReportDefaults
}

export interface ReportState {
    reports: { [key: string]: Report },
    pageIdx: number,
    currentReport: null | string,
    loadState: {
        items: { [key: string]: boolean },
        isLoaded: boolean
    },
    printStatus: boolean,
    printFileType: undefined | string
    error: null | {
        type: string
        pageIdx: number
        reportName: string
    }
};