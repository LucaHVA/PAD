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

    async #showOverview(event) {


        const username = App.sessionManager.get("username")
        const userId = await this.#usersRepository.getUserId(username)

        let transactionsResponse = await this.#transactionRepository.collectTransaction(userId.id)
        let transactions = transactionsResponse.data;
        console.log(transactions)

        //format the date




        //calls to a container that exists inside the html
        const transactionsContainer = document.getElementById("transactions-container")
        transactionsContainer.style.height = "500px"

        if (transactions.size===0){
            transactionsContainer.innerHTML = "<p style='text-align: center;'>No transactions found.</p>";
            transactionsContainer.style.overflowY = "hidden"; // Adjust overflow style if needed
        } else {

            //creates a box for every transaction
            transactions.forEach(transaction => {

                const transactionBox = document.createElement("div");
                transactionBox.className = "transaction-box border border-primary rounded-pill bg-primary text-white p-4 m-4 text-center";
                transactionsContainer.style.overflowY = "auto"
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
                deleteButton.addEventListener('click', async () => {
                    transactionsContainer.removeChild(transactionBox);
                    this.#transactionRepository.deleteTransaction(`${transaction.id}`)
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