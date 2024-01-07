/**
 * Repository for entity Transactions
 * @author Luca Rijkbost
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class TransactionRepository{
    #networkManager;
    #route;

    constructor() {
        this.#route="/transactions";
        this.#networkManager=new NetworkManager();
    }

    /**
     * Async function that sends the transaction data to network manager which will send it to our back-end to see
     * if all parameters are found
     *
     * POST request, so send data as an object which will be added to the body of the request by the network manager
     * @param description
     * @param amount
     * @param date
     * @param userId
     * @returns {Promise<transaction>}
     */
createTransaction(description,amount,date, userId){
       return this.#networkManager.doRequest(this.#route, "POST",{description:description, amount:amount,
            date:date, user_id:userId})
}

    /**
     * Sends a request to retrieve transactions for a specific user.
     * @param {string} userId
     * @returns {Promise<object>}
     */
collectTransactions(userId){
        return this.#networkManager.doRequest(`${this.#route}/${userId}`,"GET")
}

    /**
     * Sends a request to delete a transaction.
     * @param {string} id
     * @returns {Promise<void>}
     */
deleteTransaction(id){
        return this.#networkManager.doRequest(`${this.#route}/${id}`, "DELETE")
}

/**
 * Sends a request to edit a transaction.
 * @param {string} id
 * @param {number} amount
 * @param {date} date
 * @param {string} description
 * @returns {Promise<void>}
 */
editTransaction(id,amount,date,description){
        return this.#networkManager.doRequest(`${this.#route}/${id}`, "PUT",{amount:amount, date:date,
        description:description})
}

}