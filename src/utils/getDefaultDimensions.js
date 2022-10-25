
export const getDefaultDimensions = () => ({
    defaultX:
      window.innerWidth <= 1024
        ? window.innerWidth * 0.1
        : window.innerWidth <= 1400
        ? window.innerWidth - 400
        : window.innerWidth - 500,
    defaultXLong:
      window.innerWidth <= 1024
        ? window.innerWidth * 0.1
        : window.innerWidth <= 1400
        ? window.innerWidth - 450
        : window.innerWidth - 550,
    defaultY: window.innerWidth <= 1024 ? window.innerHeight * 0.25 : 75,
    defaultWidth: window.innerWidth <= 1024 ? window.innerWidth * 0.8 : 300,
    defaultWidthLong:
      window.innerWidth <= 1024
        ? window.innerWidth * 0.8
        : window.innerWidth * 0.25,
    defaultHeight:
      window.innerWidth <= 1024
        ? window.innerHeight * 0.4
        : window.innerHeight * 0.2,
    defaultHeightManual:
      window.innerWidth <= 1024
        ? window.innerHeight * 0.7
        : window.innerHeight * 0.5,
    defaultWidthManual:
      window.innerWidth <= 1024
        ? window.innerWidth * 0.5
        : window.innerWidth * 0.35,
    defaultXManual:
      window.innerWidth <= 1024
        ? window.innerWidth * 0.25
        : window.innerWidth * 0.25,
    defaultYManual:
      window.innerWidth <= 1024
        ? window.innerHeight * 0.15
        : window.innerHeight * 0.325,
    minHeight: window.innerWidth <= 1024 ? window.innerHeight * 0.5 : 200,
    minWidth: window.innerWidth <= 1024 ? window.innerWidth * 0.5 : 200,
  });