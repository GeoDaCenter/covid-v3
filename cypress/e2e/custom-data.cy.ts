import {
  resetMap,
} from '../utils.cy'

describe('Initial Map Load', () => {
  it('loads the map', () => {
    cy.visit('http://localhost:8080/map')
  })
  it('can load custom data', () => {
    const dataUrl = "https://raw.githubusercontent.com/Matico-Platform/sample-data/main/sdoh/health-factors-county-chrr.geojson"
    cy.get('#add-data-button').click()
    cy.get('button[data-id="file-link"', {timeout: 250}).click()
    cy.get('#remoteUrl', {timeout: 250}).type(dataUrl)
    cy.get('input[value="Validate"]', {timeout: 250}).click()
    cy.get('#preloaderContainer', {timeout: 15000}).should('not.exist')
    cy.get('button[aria-label="next step"]', {timeout: 250}).click()
    cy.get('button[aria-label="Add a variable"]', {timeout: 250}).click()
     
    const fields = cy.get('div[role="presentation"]', {timeout: 250}).eq(1)
    
    fields.find('#variableName').type('test')
    
    cy.get('#numerSelect', {timeout: 250}).click({timeout: 250})
    cy.get('div[role="presentation"] ul.MuiList-root li', {timeout: 250}).eq(7).click({timeout: 250})
    cy.wait(250)
    cy.get('#denomSelect', {timeout: 250}).click({timeout: 250})
    cy.get('div[role="presentation"] ul.MuiList-root li', {timeout: 250}).eq(9).click({timeout: 250})
    cy.wait(250)
    cy.get('#colorScaleSelect', {timeout: 250}).click({timeout: 250})
    cy.get('div[role="presentation"] ul.MuiList-root li', {timeout: 250}).eq(7).click({timeout: 250})

    cy.get('button[aria-label="Save Variable"]').click({timeout: 250})
    cy.get('button[aria-label="Load Data"]').click({timeout: 250})  
    resetMap()
  })
})
