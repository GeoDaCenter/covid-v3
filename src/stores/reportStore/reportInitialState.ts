const INITIAL_STATE = {
    reports: {},
    pageIdx: 0,
    currentReport: null,
    loadState: {
      items: {},
      isLoaded: false
    },
    printStatus: false,
    printFileType: undefined,
    error: null
  }
  export default INITIAL_STATE;