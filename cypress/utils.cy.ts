
export const assertNotLoading = () => {
    cy.get('#preloaderContainer', {timeout: 15000}).should('not.exist')
  }
  
export const resetMap = () => {
    cy.get('body').click()
    cy.get('#variableSelect', {timeout: 500}).click()
    cy.get('#variableMenu ul li').eq(2).click()
    cy.get('#mapType label').eq(0).click()
    cy.get('#dateSelector', {timeout: 500}).click()
    cy.get('div[role=presentation] ul li:not([data-value="x"])').eq(2).click()
    assertNotLoading()
  }
  
export const clickIndex = (selector: string, index: number, delay: number=250) => {
    const el = cy.get(selector, {timeout: delay}).eq(index)
    try {
      el.click({timeout: delay})
    } catch (e) {
      console.log(e)
    }
    // if (false || el.style.display === "none")  {
  
    // } else {
    //   el.click()
    // }
    assertNotLoading()
  }
  
export const setCalendarDate = (year: string, month: string, day: string) => {
    cy.get('input[aria-label="Year"]', {timeout: 250}).type(year)
    cy.get('input[aria-label="Month"]', {timeout: 250}).type(month)
    cy.get('input[aria-label="Day"]', {timeout: 250}).type(day)
    assertNotLoading()
  }
  
export const clickEachInSelector = (menuSelector: string, subSelector: string, delay: number=250, callback?: () => void) => {
    cy.get(menuSelector, {timeout: delay}).click()
    cy.get(subSelector, {timeout: delay}).each((_el, index, _list) => {
      clickIndex(subSelector, index, 1000)
      callback && callback()
    })
  }