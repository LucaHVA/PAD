import {Controller} from "./controller.js";
import {TransactionRepository} from "../repositories/transactionRepository.js";

/**
 * controller for creating transactions
 */

export  class RegisterTransactionController extends Controller{
    #registerTransactionView;
    #transactionsRepository;

    constructor() {
        super();
this.#transactionsRepository=new TransactionRepository
        this.#setupview();

    }

    async #setupview(){

this.#registerTransactionView = await super.loadHtmlIntoContent("html_views/registerTransaction.html");

this.#registerTransactionView.querySelector('.btn').addEventListener("click",
    (event)=>this.#saveTransaction(event))

        this.#setDefaultDate();
}


    #setDefaultDate() {

        this.#registerTransactionView.querySelector('#inputDate').value = new Date().toISOString().split('T')[0];
    }

async #saveTransaction(event) {
    event.preventDefault();

    let description = this.#registerTransactionView.querySelector("#inputDescription").value
    let amount = this.#registerTransactionView.querySelector("#inputAmount").value
    let date = this.#registerTransactionView.querySelector("#inputDate").value
    console.log(description, amount, date);

    const errorMessage = this.#registerTransactionView.querySelector(".error")
    if (description.length === 0 || amount.length === 0) {
        errorMessage.innerHTML = "Vakken mogen niet leeg zijn"
        return
    }
    {
        errorMessage.innerHTML = ""
        try {
            errorMessage.innerHTML="";
            const data = await this.#transactionsRepository.createTransaction(description, amount, date)
            errorMessage.innerHTML="gelukt!"
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