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
        transactionsContainer.style.height = "vh-100";

        const totalContainer = document.getElementById("transaction-total");
        totalContainer.className = "transaction-box rounded-pill text-white p-4 m-2 text-center d-flex justify-content-between align-items-center";
        totalContainer.style.backgroundColor = "#2F72B9";
        totalContainer.style.overflowY = "auto";
        await this.getTotal(userId)



        // totalContainer.style.height = "100px";
        const bestContainer = document.getElementById("transaction-best");
        bestContainer.className = "transaction-box rounded-pill text-white p-4 m-2 text-center d-flex justify-content-between align-items-center";
        bestContainer.style.backgroundColor = "#2F72B9";
        bestContainer.style.overflowY = "auto";
        await this.getBestDate(userId)

        if (transactions.size === 0) {
            transactionsContainer.innerHTML = "<p style='text-align: center;'>No transactions found.</p>";
            transactionsContainer.style.overflowY = "hidden"; // Adjust overflow style if needed
        } else {
            //if there are transactions load them all in boxes
            transactions.forEach(transaction => {
                const transactionBox = document.createElement("div");
                transactionBox.className = "transaction-box rounded-pill text-white p-4 m-2 text-center d-flex justify-content-between align-items-center";
                transactionsContainer.style.overflowY = "auto";
                transactionBox.style.backgroundColor = "#2F72B9";

                //format the date to a local version
                //make a container for the button for better calling
                const buttonsContainer = document.createElement("div");
                buttonsContainer.className = " d-flex justify-content-between w-30";
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
                let formattedDate=this.#setFormatDate(transaction.date)

                //shows the transaction info
                transactionBox.innerHTML = `
                    <p class="amount">bedrag (€): ${amountDisplay}</p>
                    <p class="date"> ${formattedDate}</p>
                    <p class="description"> beschrijving: ${transaction.description}</p>
      `;
//method to delete a transaction
                deleteButton.addEventListener('click', async () => {
                    //asks for confirmation
                    const confirmation = window.confirm("Are you sure you want to delete this transaction?");

                    if (confirmation) {
                        transactionsContainer.removeChild(transactionBox);
                        try {//Tries to delete it otherwise gives an error message in the console and on screen
                            await this.#transactionRepository.deleteTransaction(`${transaction.id}`);
                            await this.getTotal(userId);
                            await this.getBestDate(userId)
                        } catch (error) {

                            console.error("Error deleting transaction:", error);
                            const errorMessageContainer = document.getElementById("error-message-container");
                            errorMessageContainer.innerHTML = "<p style='color: red;'>Er is iets fout gegaan bij het editen van de data</p>";
                        }
                    }
                });

                //Method to insert new values inside the transaction
                editButton.addEventListener('click', async () => {
                    console.log(formattedDate)
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
                            <p> datum: ${editedFormattedDate}</p>
                            <p>Beschrijving: ${editedTransaction.description}</p>
                        `;

                        //reads the buttons aswell
                        transactionBox.appendChild(buttonsContainer);
                        buttonsContainer.appendChild(deleteButton);
                        buttonsContainer.appendChild(editButton);

                        //Makes the new values the current value
                        formattedAmount = editedTransaction.amount;
                     transaction.description = editedTransaction.description;
                        formattedDate = editedTransaction.date;

                        await this.getTotal(userId);
                        await this.getBestDate(userId)
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
                            <p> datum: ${formattedDate}</p>
                            <p> beschrijving: ${transaction.description}</p>
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


    //method to get the total amount
    async getTotal(userId){
        const totalContainer= document.getElementById("transaction-total")
        try {
            const transactionResponse= await  this.#transactionRepository.getTotalTransaction(userId.id)
            if (transactionResponse.totalAmount !== undefined) {
                totalContainer.innerHTML = `<p>Totaal bedrag: €${transactionResponse.totalAmount}</p>`;
                return transactionResponse.totalAmount;
            } else {
                totalContainer.innerHTML = `<p>Er is iets fout gegaan bij het halen van het totaalbedrag</p>`;
                return 0; // return a default value if nothing is found
            }
        } catch (error) {
            console.error("Error fetching total amount:", error);
            totalContainer.innerHTML = `<p>Er is iets fout gegaan bij het halen van het totaalbedrag</p>`;
            return 0;
        }
    }

    //method to get the best date
    async getBestDate(userId){
        const bestContainer= document.getElementById("transaction-best")
        try {
            const transactionResponse= await  this.#transactionRepository.getBestDateTransaction(userId.id)
            console.log(transactionResponse)
            let formattedDate=this.#setFormatDate(transactionResponse.bestDate)
            if (transactionResponse.bestDate !== undefined) {
                bestContainer.innerHTML = `<p>Best verdiende dag: ${formattedDate}</p>`;
                return formattedDate;
            } else {
                bestContainer.innerHTML = `<p>Er is iets fout gegaan bij het halen je beste dag</p>`;
                return 0; // return a default value if nothing is found
            }
        } catch (error) {
            console.error("Error fetching total amount:", error);
            bestContainer.innerHTML = `<p>Er is iets fout gegaan bij het halen van je beste datum</p>`;
            return 0;
        }
    }

    //set the date format
    #setFormatDate(date) {

       date = new Date(date).toISOString().split('T')[0];
       return date
    }



}
