import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";
import {App} from "../app.js";
import {UsersRepository} from "../repositories/usersRepository.js";

/**
 * controller for creating transactions
 * @author Luca Rijkbost
 */

export  class RegisterTransactionController extends Controller{
    #registerTransactionView;
    #transactionsRepository;
    #usersRepository;
    #app

    constructor() {
        super();
this.#transactionsRepository=new TransactionRepository
        this.#usersRepository= new UsersRepository()


        this.#setupview();



    }

    async #setupview(){

this.#registerTransactionView = await super.loadHtmlIntoContent("html_views/registerTransaction.html");

this.#registerTransactionView.querySelector('.btn').addEventListener("click",
    (event)=>this.#saveTransaction(event))
        this.#setDefaultDate();

this.#registerTransactionView.querySelector('#spendToggle').addEventListener("click",
    ()=> this.#toggleSpending());
}


    #setDefaultDate() {

        this.#registerTransactionView.querySelector('#inputDate').value = new Date().toISOString().split('T')[0];
    }

    #toggleSpending(){
        const toggleSwitch = this.#registerTransactionView.querySelector('#spendToggle');
        const amountInput = this.#registerTransactionView.querySelector("#inputAmount");

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

    let description = this.#registerTransactionView.querySelector("#inputDescription").value
    let amount = this.#registerTransactionView.querySelector("#inputAmount").value
    let date = this.#registerTransactionView.querySelector("#inputDate").value
    let username=App.sessionManager.get("username")
    let userId = await this.#usersRepository.getUserId(username)


    console.log(description, amount, date,userId.id);

    const errorMessage = this.#registerTransactionView.querySelector(".error")


    if (description.length === 0 || amount.length === 0 ) {
        errorMessage.innerHTML = "Vakken mogen niet leeg zijn";
        return
    } if (amount.includes('-')){
        errorMessage.innerHTML='nope'
        return
    }
    {
        errorMessage.innerHTML = ""
        try {
            let processedAmount = parseFloat(amount);
            const toggleSwitch = this.#registerTransactionView.querySelector('#spendToggle');
            if (toggleSwitch.checked) {
                processedAmount = -Math.abs(processedAmount);
            }

            errorMessage.innerHTML="";
            const data = await this.#transactionsRepository.createTransaction(description, processedAmount, date, userId.id)
            errorMessage.innerHTML="gelukt!";
            this.#registerTransactionView.querySelector("#inputDescription").value = "";
            this.#registerTransactionView.querySelector("#inputAmount").value = "";

            console.log(data)
        }
        catch (e){
            console.log(e)
            errorMessage.innerHTML="Er gaat iets fout bij het opgeven van de transactie"
        }
    }
}

}