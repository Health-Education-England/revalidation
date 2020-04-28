describe("Trainee search", () => {
  const searchForm = "app-trainee-search form";

  it("should allow me to visit the page", () => {
    cy.visit("/trainees");
  });

  it("should contain trainee search elements", () => {
    cy.get(searchForm);
    cy.get(searchForm).find(".mat-input-element");
    cy.get(searchForm).find(".mat-primary");
  });

  it("should show validation error if empty form submitted", () => {
    cy.get(searchForm).submit();
    cy.get(searchForm)
      .find(".mat-error")
      .should("contain.text", "No search terms entered");
  });

  it("should contain `searchQuery` parameter in url when search is performed", () => {
    cy.get(searchForm).find(".mat-input-element").type("roberto");
    cy.get(searchForm).submit();
    cy.location().should((loc) =>
      expect(loc.search).to.contain("searchQuery=roberto")
    );
  });

  it("should not contain `searchQuery` parameter in url when `Clear all` is clicked", () => {
    cy.get("app-reset-trainee-list button").click();
    cy.location().should((loc) =>
      expect(loc.search).to.not.contain("searchQuery")
    );
  });
});