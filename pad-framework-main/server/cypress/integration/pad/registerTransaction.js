describe('Register Transaction', () => {
    it('should register a new transaction', () => {
        // Visit the page
        cy.visit("http://localhost:3000");

        // Interact with the form
        cy.get('#inputDescription').type('cypress transactie');
        cy.get('#inputAmount').type('50');
        cy.get('#inputDate').type('2024-01-10');
        cy.get('.btn-danger').click(); // Click the "Opslaan" button

        // Validate the result
        cy.get('.error').should('not.exist'); // Check if there are no error messages
        cy.contains('gelukt!').should('exist'); // Check if success message exists
    });


});