
describe('Delete Transaction', () => {
    it('Deletes a transaction with description "cypress transactie" or handles error', () => {
        cy.visit('http://localhost:3000');

        // assuming the transaction with description "cypress transactie" exists
        const transactionDescription = 'cypress transactie';

        // locate and click the delete button for the transaction with the specified description
        cy.contains('.description', transactionDescription)
            .parent()
            .within(() => {
                cy.get('.btn-danger').click(); // Click the delete button
            });

        // confirm the deletion in the confirmation dialog
        cy.on('window:confirm', () => true);

        // check if the transaction is removed from the view
        cy.contains('.description', transactionDescription).should('not.exist');

        // test the error handling for a non-existent transaction
        const nonExistentTransactionDescription = 'non-existent transaction';

        // Attempt to delete a transaction that doesn't exist
        cy.contains('.description', nonExistentTransactionDescription)
            .parent()
            .within(() => {
                cy.get('.btn-danger').click(); // Click the delete button
            });

        // Check if an error message is displayed
        cy.get('#error-message-container').should('contain', 'Error deleting transaction');
    });
});