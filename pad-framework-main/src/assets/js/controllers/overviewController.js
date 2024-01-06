import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {UsersRepository} from "../repositories/usersRepository.js";
import {App} from "../app.js";

/**
 * @author Luca Rijkbost
 * controller to see the overview
 */



/**
 * @author Luca Rijkbost
 * controller to see the overview
 */

export class OverviewController extends Controller {
    #overviewView;
    #transactionRepository;
    #usersRepository;

    constructor() {
        super();
        this.#transactionRepository = new TransactionRepository();
        this.#usersRepository = new UsersRepository();
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
        const userId = await this.#usersRepository.getUserId(username);

        // Extract a list from the database
        let transactionsResponse = await this.#transactionRepository.collectTransaction(userId.id);
        let transactions = transactionsResponse.data;
        console.log(transactions);

        // Calls to a container that exists inside the HTML
        const transactionsContainer = document.getElementById("transactions-container");
        transactionsContainer.style.height = "500px";

        if (transactions.size === 0) {
            transactionsContainer.innerHTML = "<p style='text-align: center;'>No transactions found.</p>";
            transactionsContainer.style.overflowY = "hidden"; // Adjust overflow style if needed

        } else {
            transactions.forEach(transaction => {
                const transactionBox = document.createElement("div");
                transactionBox.className = "transaction-box border border-primary rounded-pill bg-primary text-white p-4 m-4 text-center d-flex justify-content-between align-items-center";
                transactionsContainer.style.overflowY = "auto";

                const formattedDate = new Date(transaction.date).toISOString().split('T')[0];

                const buttonsContainer = document.createElement("div");
                buttonsContainer.className = "d-flex justify-content-between w-100";

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger";
                deleteButton.innerHTML = "Delete";

                const editButton = document.createElement("button");
                editButton.className = "btn btn-warning";
                editButton.innerHTML = "Edit";

                const isNegative = transaction.amount.toString().includes('-');
                const amountDisplay = isNegative ? transaction.amount : `+ ${transaction.amount}`;

                transactionBox.innerHTML = `
                    <p>amount: € ${amountDisplay}</p>
                    <p>date: ${formattedDate}</p>
                    <p>description: ${transaction.description}</p>
                `;

                deleteButton.addEventListener('click', async () => {
                    transactionsContainer.removeChild(transactionBox);
                    await this.#transactionRepository.deleteTransaction(`${transaction.id}`);
                });

                let originalAmount = transaction.amount
                let originalDate = formattedDate;
                let originalDescription = transaction.description;
                editButton.addEventListener('click', async () => {

                    transactionBox.innerHTML = `
                        <input type="number" min="1" step="any" class="form-control" value="${originalAmount}" id="editAmount">
                        <input type="date" class="form-control" value="${originalDate}" id="editDate">
                        <input type="text" class="form-control" value="${originalDescription}" id="editDescription">
                        <button class="btn btn-success" id="saveEdit">Save</button>
                        <button class="btn btn-danger" id="cancelEdit">Cancel</button>
                    `;

                    const saveEditButton = transactionBox.querySelector("#saveEdit");
                    saveEditButton.addEventListener('click', async () => {
                        const editedTransaction = {
                            id: transaction.id,
                            amount: document.getElementById("editAmount").value,
                            date: document.getElementById("editDate").value,
                            description: document.getElementById("editDescription").value,
                        };

                        if (editedTransaction.amount === '' || editedTransaction.date === '' || editedTransaction.description === '') {
                            // Create an error message element
                            const errorMessage = document.createElement('p');
                            errorMessage.classList.add('text-danger');
                            errorMessage.textContent = 'Error: All fields must be filled.';

                            // Append the error message below the transaction box
                            transactionBox.insertAdjacentElement('afterend', errorMessage);
                            return; // Stop the function if there's an error
                        }

                        await this.#transactionRepository.editTransaction(
                            editedTransaction.id,
                            editedTransaction.amount,
                            editedTransaction.date,
                            editedTransaction.description
                        );

                        const isNegativeEdited = editedTransaction.amount.includes('-');
                        const editedAmountDisplay = isNegativeEdited ? editedTransaction.amount : `+${editedTransaction.amount}`;

                        transactionBox.innerHTML = `
                            <p>amount: €${editedAmountDisplay}</p>
                            <p>date: ${editedTransaction.date}</p>
                            <p>description: ${editedTransaction.description}</p>
                        `;

                        transactionBox.appendChild(deleteButton);
                        transactionBox.appendChild(editButton);
                        console.log("amount before edit "+originalAmount)
                        console.log("amount when edited "+ editedTransaction.amount)
                        originalAmount = editedTransaction.amount;
                        console.log("amount should be edited"+ originalAmount)
                        originalDescription = editedTransaction.description;
                        originalDate = editedTransaction.date;


                    });

                    transactionBox.querySelector("#cancelEdit").addEventListener('click', async () => {

                        const existingErrorMessage = transactionBox.nextElementSibling;
                        if (existingErrorMessage && existingErrorMessage.classList.contains('text-danger')) {
                            existingErrorMessage.remove();
                        }
                        transactionBox.innerHTML = `
                            <p>amount: € ${originalAmount}</p>
                            <p>date: ${originalDate}</p>
                            <p>description: ${originalDescription}</p>
                        `;

                        transactionBox.appendChild(deleteButton);
                        transactionBox.appendChild(editButton);
                    });
                });

                transactionsContainer.appendChild(transactionBox);
                transactionBox.appendChild(deleteButton);
                transactionBox.appendChild(editButton);
            });
        }
    }
}
