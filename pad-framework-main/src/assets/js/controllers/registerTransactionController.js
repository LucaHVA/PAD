import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {App} from "../app.js";
import {UserRepository} from "../repositories/userRepository.js";

/**
 * controller for creating transactions
 * @author Luca Rijkbost
 */

export class RegisterTransactionController extends Controller {
    #registerTransactionView;
    #transactionsRepository;
    #usersRepository;
    #app

    constructor() {
        super();
        this.#transactionsRepository = new TransactionRepository
        this.#usersRepository = new UserRepository()


        this.#setupview();


    }

    async #setupview() {
//loads html in
        this.#registerTransactionView = await super.loadHtmlIntoContent("html_views/registerTransaction.html");

        this.#registerTransactionView.querySelector('.btn').addEventListener("click",
            (event) => this.#saveTransaction(event))
        this.#setDefaultDate();

        this.#registerTransactionView.querySelector('#spendToggle').addEventListener("click",
            () => this.#toggleSpending());
    }

    #setDefaultDate() {

        this.#registerTransactionView.querySelector('#inputDate').value = new Date().toISOString().split('T')[0];
    }

    #toggleSpending() {
        const toggleSwitch = this.#registerTransactionView.querySelector('#spendToggle');

        //if the toggle is used change the background to white
        if (toggleSwitch.checked) {
            // If the switch is checked, set green background for gaining
            toggleSwitch.classList.remove("bg-white");
            toggleSwitch.classList.add("bg-danger");

        } else {
            // If the switch is not checked, set red background for spending
            toggleSwitch.classList.remove("bg-danger");
            toggleSwitch.classList.add("bg-white");

        }

    }


    async #saveTransaction(event) {
        event.preventDefault();

        //selects the values for later methods
        let description = this.#registerTransactionView.querySelector("#inputDescription").value
        let amount = this.#registerTransactionView.querySelector("#inputAmount").value
        let date = this.#registerTransactionView.querySelector("#inputDate").value
        let username = App.sessionManager.get("username")
        let userId = await this.#usersRepository.getUserId(username)

        const transactionForm = document.querySelector('.transaction-form');
//styling for the transactionforms
        transactionForm.style.border = '2px solid #2F72B9';
        transactionForm.style.backgroundColor = '#2F72B9';


        const errorMessage = this.#registerTransactionView.querySelector(".error")

//adds error in the case of a strange character or empty fields
        if (description.length === 0 || amount.length === 0) {
            errorMessage.innerHTML = "Vakken mogen niet leeg zijn";
            return
        }
        if (amount.includes('-','+')) {
            errorMessage.innerHTML = 'U kan geen tekens gebruiken. bij een uitgave druk op de toggle knop'
            return
        }


        {
            errorMessage.innerHTML = ""
            try {
                //parse to float to make the number negative
                let processedAmount = parseFloat(amount);
                const toggleSwitch = this.#registerTransactionView.querySelector('#spendToggle');
                if (toggleSwitch.checked) {
                    processedAmount = -Math.abs(processedAmount);
                }
//sends the data repository so it can reach the database
                errorMessage.innerHTML = "";
                const data = await this.#transactionsRepository.createTransaction
                (description, processedAmount, date, userId.id)
                errorMessage.innerHTML = "gelukt!";
                this.#registerTransactionView.querySelector("#inputDescription").value = "";
                this.#registerTransactionView.querySelector("#inputAmount").value = "";

                console.log(data)
            } catch (e) {
                console.log(e)
                errorMessage.innerHTML = "Er gaat iets fout bij het opgeven van de transactie"
            }
        }
    }

}