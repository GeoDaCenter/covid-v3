const clickIndex = (selector: string, index: number, delay: number=250) => {
  cy.get(selector, {timeout: delay}).eq(index).click()
  cy.get('#preloaderContainer', {timeout: 5000}).should('not.exist')
}

const resetMap = () => {
  cy.get('#variableSelect', {timeout: 500}).click()
  cy.get('#variableMenu ul li').eq(2).click()
  cy.get('#preloaderContainer', {timeout: 5000}).should('not.exist')
}

const setCalendarDate = (year: string, month: string, day: string) => {
  cy.get('input[aria-label="Year"]', {timeout: 250}).type(year)
  cy.get('input[aria-label="Month"]', {timeout: 250}).type(month)
  cy.get('input[aria-label="Day"]', {timeout: 250}).type(day)
  cy.get('#preloaderContainer', {timeout: 5000}).should('not.exist')
}

const datesToTest = {
  years: ['2020', '2021', '2022'],
  months: new Array(6).fill(null).map((n, i) => `${(i+1)*2}`),
  day: ['28']
}

describe('Initial Map Load', () => {
  it('loads the map', () => {
    cy.visit('http://localhost:8080/map')
  })
  // it('can change variables, geographies, and datasets', () => {
  //   cy.get('#variableSelect').click()
  //   cy.get('#variableMenu ul li[aria-disabled!="true"]').each((_el, index, _list) => {
  //     clickIndex('#variableMenu ul li[aria-disabled!="true"]', index, 1000)

  //     cy.get('#geographySelect').click()
  //     cy.get('div[role="presentation"] ul li[aria-disabled!="true"]').each((_el, geogIndex, _list) => {
  //       if (_list.length > 1) {
  //         clickIndex('div[role="presentation"] ul li[aria-disabled!="true"]', geogIndex)
  //       } else {
  //         cy.get('body').click()
  //       }
  //       cy.get('#datasetSelect').click()
  //       cy.get('div[role="presentation"] ul li[aria-disabled!="true"]').each((_el, datasetIndex, _list) => {
  //         if (_list.length > 1){
  //           clickIndex('div[role="presentation"] ul li[aria-disabled!="true"]', datasetIndex)
  //           datasetIndex !== _list.length -1 && cy.get('#datasetSelect').click()
  //         } else {
  //           cy.get('body').click()
  //         }
  //       })
  //       geogIndex !== _list.length -1 && cy.get('#geographySelect').click()
  //     })
  //     index !== _list.length -1 && cy.get('#variableSelect').click()
  //   })
  // })
  it('can change time', () => {
      resetMap()
      const {years, months, day} = datesToTest
      years.forEach(year => {
        months.forEach(month => {
          day.forEach(day => {
            setCalendarDate(year, month, day)
          })
        })
      })
  })
  it('can change map mode', () => {
    resetMap()
    
  })

})
