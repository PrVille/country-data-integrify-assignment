describe("Countries app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
  })

  it("front page can be opened", () => {
    cy.contains("Countries")
    cy.contains("Afghanistan")
  })

  describe("Table of countries", () => {
    it("can navigate table pages", () => {
      cy.get(`[data-testid=KeyboardArrowRightIcon]`).click()
      cy.contains("Angola")
      cy.get(`[data-testid=KeyboardArrowRightIcon]`).click()
      cy.contains("11–15 of 250")
    })

    it("can sort table by country name", () => {
      cy.contains("Name").click()
      cy.contains("Zimbabwe")
      cy.contains("Name").click()
      cy.contains("Albania")
    })

    it("can search by country name", () => {
      cy.get("input:first").type("fin")
      cy.contains("Finland")
    })
  })

  describe("Single country", () => {
    it("can open single country details from table", () => {
      cy.contains("Algeria").click()
      cy.contains("Algiers")
      cy.contains("The country belongs to Africa")
    })

    it("can expand details modal", () => {
      cy.contains("Algeria").click()
      cy.get(`[data-testid=ExpandMoreIcon]`).click()
      cy.contains("Currencies")
    })
  })
})
