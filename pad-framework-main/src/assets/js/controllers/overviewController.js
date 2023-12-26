import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {UsersRepository} from "../repositories/usersRepository.js";
import {App} from "../app.js";


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

        // //format the date
        // const formattedDate = new Date(transactions.date).toISOString().split('T')[0];
        console.log(transactions.date)



        //calls to a container that exists inside the html
        const transactionsContainer = document.getElementById("transactions-container")
        transactionsContainer.style.height = "500px"

        console.log(transactions)
        //creates a box for every transaction
        transactions.forEach(transaction => {
            const transactionBox = document.createElement("div");
            transactionBox.className = "transaction-box border border-primary rounded-pill bg-primary text-white p-4 m-4 text-center";
            transactionsContainer.style.overflowY = "auto"

            //fills the boxes with the information
            transactionBox.innerHTML = `
            <p>amount: € ${transaction.amount}</p>
            <p>date: ${transaction.date}</p>
            <p>description: ${transaction.description}</p>
        `;
            transactionBox.addEventListener('click',()=>{
                console.log(`${transaction.id}`)
            })

            // append the transaction box to the container
            transactionsContainer.appendChild(transactionBox);
        });

        console.log(transactions)
    }

}