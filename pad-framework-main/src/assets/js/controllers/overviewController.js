import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {UserRepository} from "../repositories/userRepository.js";
import {App} from "../app.js";

/**
 * @author Luca Rijkbost
 * controller to see the overview
 */

export class OverviewController extends Controller {
    #overviewView;
    #transactionRepository;
    #userRepository;

    constructor() {
        super();
        this.#transactionRepository = new TransactionRepository();
        this.#userRepository = new UserRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#overviewView = await super.loadHtmlIntoContent("html_views/overview.html");

        await this.#showOverview();
    }

    // Function that shows all transactions with the functions of the buttons
    async #showOverview() {
        // Get the user id
        const username = App.sessionManager.get("username");
        const userId = await this.#userRepository.getUserId(username);

        // Extract a list from the database
        let transactionsResponse;
        try {
            transactionsResponse = await this.#transactionRepository.collectTransactions(userId.id);
        } catch (error) {
            console.error("Error collecting transactions:", error);
            const errorMessageContainer = document.getElementById("error-message-container");
            errorMessageContainer.innerHTML = "<p style='color: red;'>Er is iets fout gegaan bij het ophalen van uw transacties</p>";
        }

        let transactions = transactionsResponse.data;
        //log all the transactions
        console.log(transactions);

        // Calls to a container that exists inside the HTML
        const transactionsContainer = document.getElementById("transactions-container");
        transactionsContainer.style.height = "500px";

        if (transactions.size === 0) {
            transactionsContainer.innerHTML = "<p style='text-align: center;'>No transactions found.</p>";
            transactionsContainer.style.overflowY = "hidden"; // Adjust overflow style if needed
        } else {
            //if there are transactions load them all in boxes
            transactions.forEach(transaction => {
                const transactionBox = document.createElement("div");
                transactionBox.className = "transaction-box rounded-pill  text-white p-4 m-2 text-center d-flex justify-content-between align-items-center";
                transactionsContainer.style.overflowY = "auto";
                transactionBox.style.backgroundColor = "#2F72B9";

                //format the date to a local version
                let formattedDate = new Date(transaction.date).toLocaleDateString('en-GB');

                //make a container for the button for better calling
                const buttonsContainer = document.createElement("div");
                buttonsContainer.className = "d-flex justify-content-between w-30";

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger mr-2";
                deleteButton.innerHTML = "Delete";

                const editButton = document.createElement("button");
                editButton.className = "btn btn-warning";
                editButton.innerHTML = "Edit";
                editButton.style.margin;

                const isNegative = transaction.amount.toString().includes('-');//checks if the amount is negative
                let formattedAmount = parseFloat(transaction.amount).toFixed(2);// makes it so that it has 2 decimals
                const amountDisplay = isNegative ? formattedAmount : `+ ${formattedAmount}`;//if there was no negative found add a +

                //shows the transaction info
                transactionBox.innerHTML = `
                    <p class="amount">bedrag (€): ${amountDisplay}</p>
                    <p class="date"> ${formattedDate}</p>
                    <p class="description"> ${transaction.description}</p>
                `;
//method to delete a transaction
                deleteButton.addEventListener('click', async () => {
                    //asks for confirmation
                    const confirmation = window.confirm("Are you sure you want to delete this transaction?");

                    if (confirmation) {
                        transactionsContainer.removeChild(transactionBox);
                        try {//Tries to delete it otherwise gives an error message in the console and on screen
                            await this.#transactionRepository.deleteTransaction(`${transaction.id}`);
                        } catch (error) {

                            console.error("Error deleting transaction:", error);
                            const errorMessageContainer = document.getElementById("error-message-container");
                            errorMessageContainer.innerHTML = "<p style='color: red;'>Er is iets fout gegaan bij het editen van de data</p>";
                        }
                    }
                });

                //Method to insert new values inside the transaction
                editButton.addEventListener('click', async () => {
                    transactionBox.innerHTML = `
                        <input type="number" min="1" step="any" class="form-control" value="${formattedAmount}" id="editAmount">
                        <input type="date" class="form-control" value="${formattedDate}" id="editDate">
                        <input type="text" class="form-control" value="${transaction.description}" id="editDescription">
                        <button class="btn btn-success" id="saveEdit">Save</button>
                        <button class="btn btn-danger" id="cancelEdit">Cancel</button>
                    `;


                    const saveEditButton = transactionBox.querySelector("#saveEdit");
                    saveEditButton.addEventListener('click', async () => {
                        const editedTransaction = {//gets the values for later insertion
                            id: transaction.id,
                            amount: document.getElementById("editAmount").value,
                            date: document.getElementById("editDate").value,
                            description: document.getElementById("editDescription").value,
                        };
// in the case that one of the fields is empty
                        if (editedTransaction.amount === '' || editedTransaction.date === '' || editedTransaction.description === '') {
                            // Create an error message element
                            const errorMessage = document.createElement('p');
                            errorMessage.classList.add('text-danger');
                            errorMessage.textContent = 'error alle waardes moeten ingevult worden';

                            // Append the error message below the transaction box
                            transactionBox.insertAdjacentElement('afterend', errorMessage);
                            return; // Stop the function if there's an error
                        }

                        // Remove any existing error message
                        const existingErrorMessage = transactionBox.nextElementSibling;
                        if (existingErrorMessage && existingErrorMessage.classList.contains('text-danger')) {
                            existingErrorMessage.remove();
                        }

                        try {
                            await this.#transactionRepository.editTransaction(
                                editedTransaction.id,
                                editedTransaction.amount,
                                editedTransaction.date,
                                editedTransaction.description
                            );
                        } catch (error) {
                            console.error("Error editing transaction:", error);
                            const errorMessageContainer = document.getElementById("error-message-container");
                            errorMessageContainer.innerHTML = "<p style='color: red;'>Er is iets fout gegaan bij het editen van de data</p>";
                        }
//checks again if there is a negative value in the newly inserted data
                        const isNegativeEdited = editedTransaction.amount.includes('-');
                        const editedAmountDisplay = isNegativeEdited ? editedTransaction.amount : `+${editedTransaction.amount}`;
                        const editedFormattedDate = new Date(editedTransaction.date).toLocaleDateString();

                        //reverts the box back with it's edited values
                        transactionBox.innerHTML = `
                            <p>bedrag (€): ${editedAmountDisplay}</p>
                            <p> ${editedFormattedDate}</p>
                            <p>${editedTransaction.description}</p>
                        `;

                        //reads the buttons aswell
                        transactionBox.appendChild(buttonsContainer);
                        buttonsContainer.appendChild(deleteButton);
                        buttonsContainer.appendChild(editButton);

                        //Makes the new values the current value
                        formattedAmount = editedTransaction.amount;
                     transaction.description = editedTransaction.description;
                        formattedDate = editedTransaction.date;
                    });

                    //Reverts to the original value if you want to cancel
                    transactionBox.querySelector("#cancelEdit").addEventListener('click', async () => {
                        const existingErrorMessage = transactionBox.nextElementSibling;
                        if (existingErrorMessage && existingErrorMessage.classList.contains('text-danger')) {
                            existingErrorMessage.remove();
                        }
                       //reformats the amount back
                        const originalAmountDisplay = isNegative ? formattedAmount : `+ ${formattedAmount}`;

                        //reverts data back
                        transactionBox.innerHTML = `
                            <p>bedrag (€): ${originalAmountDisplay}</p>
                            <p>${formattedDate}</p>
                            <p>${transaction.description}</p>
                        `;
//re-adds button
                        transactionBox.appendChild(buttonsContainer)
                        buttonsContainer.appendChild(deleteButton)
                        buttonsContainer.appendChild(editButton)
                    });
                });
//appends the initialy created boxes to the container
                transactionsContainer.appendChild(transactionBox);
                transactionBox.appendChild(buttonsContainer)
                buttonsContainer.appendChild(deleteButton)
                buttonsContainer.appendChild(editButton)
            });
        }
    }
}
