/// <reference types="cypress" />

describe('basic page tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('reads "commit editor" in the page title', () => {
    cy.get('h1').should('have.text', 'commit editor')
  })
})
