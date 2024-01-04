import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {UsersRepository} from "../repositories/usersRepository.js";
import {App} from "../app.js";

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

    // function that shows all transactions with the functions of the buttons
    async #showOverview() {

        //get the user id
        const username = App.sessionManager.get("username")
        const userId = await this.#usersRepository.getUserId(username)

        //extracts a list from the database
        let transactionsResponse = await this.#transactionRepository.collectTransaction(userId.id)
        let transactions = transactionsResponse.data;
        console.log(transactions)



        //calls to a container that exists inside the html
        const transactionsContainer = document.getElementById("transactions-container")
        transactionsContainer.style.height = "500px"

        if (transactions.size === 0) {
            transactionsContainer.innerHTML = "<p style='text-align: center;'>No transactions found.</p>";
            transactionsContainer.style.overflowY = "hidden"; // adjust overflow style if needed
        } else {

            //creates a box for every transaction
            transactions.forEach(transaction => {

                const transactionBox = document.createElement("div");
                transactionBox.className = "transaction-box border border-primary rounded-pill bg-primary text-white p-4 m-4 text-center";
                transactionsContainer.style.overflowY = "auto"

                //formats the date
                const formattedDate = new Date(transaction.date).toISOString().split('T')[0];

                //adds button to html
                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger"
                deleteButton.innerHTML = "Delete"

                const editButton = document.createElement("button");
                editButton.className = "btn btn-warning";
                editButton.innerHTML = "Edit";


                //fills the boxes with the information
                transactionBox.innerHTML = `
            <p>amount: € ${transaction.amount}</p>
            <p>date: ${formattedDate}</p>
            <p>description: ${transaction.description}</p>
        `;
                //adds delete function
                deleteButton.addEventListener('click', async () => {
                    transactionsContainer.removeChild(transactionBox);
                    this.#transactionRepository.deleteTransaction(`${transaction.id}`)
                })

                //adds the edit function

                editButton.addEventListener('click', async () => {
                    const originalAmount = transaction.amount;
                    const originalDate = formattedDate;
                    const originalDescription = transaction.description;

                    //changes the inner information of the transactionbox so it can be edited
                    transactionBox.innerHTML = `
                <input type="text" class="form-control" value="${originalAmount}" id="editAmount">
                <input type="date" class="form-control" value="${originalDate}" id="editDate">
                <input type="text" class="form-control" value="${originalDescription}" id="editDescription">
                <button class="btn btn-success" id="saveEdit">Save</button>
                <button class="btn btn-danger" id="cancelEdit">Cancel</button>
            `;


                    //inserts the newly edited information
                    const saveEditButton = transactionBox.querySelector("#saveEdit");
                    saveEditButton.addEventListener('click', async () => {
                        const editedTransaction = {
                            id: transaction.id,
                            amount: document.getElementById("editAmount").value,
                            date: document.getElementById("editDate").value,
                            description: document.getElementById("editDescription").value,
                        };
                        this.#transactionRepository.editTransaction(editedTransaction.id, editedTransaction.amount,
                            editedTransaction.date, editedTransaction.description)

                        //changes the transactionbox so you can't edit
                        transactionBox.innerHTML = `
            <p>amount: € ${editedTransaction.amount}</p>
            <p>date: ${editedTransaction.date}</p>
            <p>description: ${editedTransaction.description}</p>
        `;

                        // re-add the edit and delete buttons

                        transactionBox.appendChild(deleteButton);
                        transactionBox.appendChild(editButton);

                    })

                    //cancels and reverts the transactionbox back to its original state
                    transactionBox.querySelector("#cancelEdit").addEventListener('click',async ()=>{
                        transactionBox.innerHTML = `
               <p>amount: € ${originalAmount}</p>
              <p>date: ${originalDate}</p>
            <p>description: ${originalDescription}</p>
        `;

                        // re-add the edit and delete buttons
                        transactionBox.appendChild(deleteButton);
                        transactionBox.appendChild(editButton);
                    })

                    document.getElementById("editAmount").value = originalAmount;
                    document.getElementById("editDate").value = originalDate;
                    document.getElementById("editDescription").value = originalDescription;
                })

                // append the transaction box to the container
                transactionsContainer.appendChild(transactionBox);
                transactionBox.appendChild(deleteButton);
                transactionBox.appendChild(editButton);


            });

        }

        console.log(transactions)
    }

}