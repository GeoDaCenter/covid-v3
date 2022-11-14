import {
  resetMap,
  clickIndex,
  setCalendarDate,
  clickEachInSelector,
} from '../utils.cy'

const datesToTest = {
  years: ['2020', '2021', '2022'],
  months: ['6'], //new Array(6).fill(null).map((n, i) => `${(i+1)*2}`),
  day: ['28']
}

describe('Initial Map Load', () => {
  it('loads the map', () => {
    cy.visit('http://localhost:8080/map')
  })
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
    cy.get('#mapType label').each((_el, index, _list) => {
      clickIndex('#mapType label', index)
    })    
  })
  it('can change date range', () => {
    clickEachInSelector(
      '#dateSelector', 
      'div[role=presentation] ul li:not([data-value="x"])',
      250,
      () => cy.get('#dateSelector', {timeout: 250}).click()
    )
    resetMap()
  })
  it('can toggle panels', () => {
    cy.get('#icon-dock button').each((el, index, _list) => {
      clickIndex('#icon-dock button', index)
      cy.get('body').trigger('keydown', { keyCode: 27});
      cy.wait(250);
      cy.get('body').trigger('keyup', { keyCode: 27});
    })
  })
})
