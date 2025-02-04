/**
 * Routes file for transactions entity
 * @author Luca Rijkbost
 */

class TransactionsRoutes {
    #app
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app
        this.#createTransaction();
        this.#collectTransactions();
        this.#deleteTransaction();
        this.#editTransaction();
        this.#getTotalTransaction()
        this.#getBestDate()
    }

    //route initiated for posting the data to the database
    #createTransaction() {
        this.#app.post("/transactions", async (req, res) => {
                try {
                    const data = await this.#databaseHelper.handleQuery({
                        query: "INSERT INTO transactions(amount, description, date,user_id) VALUES (?,?,?,?)",
                        values: [req.body.amount, req.body.description, req.body.date, req.body.user_id]
                    });
                    if (data.insertId) {
                        res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId})
                    }
                } catch (e) {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e})
                }
            }
        )
    }

    // route initiated for collecting all the transactions within the chosen id
    #collectTransactions() {
        this.#app.get("/transactions/:user_id", async (req, res) => {

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT date, amount, description,id FROM transactions WHERE user_id=? ORDER BY id DESC",
                    values: [req.params.user_id]
                });
                if (data.length >= 1) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).send({data});
                } else if (req.body.user_id === 0) {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: "No user id has been found"})

                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    // route initiated for deleting a transaction within the chosen id
    #deleteTransaction() {
        this.#app.delete('/transactions/:id', async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "DELETE FROM transactions WHERE id=?",
                    values: [req.params.id]
                });

                if (data.affectedRows) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ message: "Transaction deleted" });
                } else {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: "No transaction to remove" });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }


    // route initiated to edit a transaction with the right id
    #editTransaction() {
        this.#app.put('/transactions/:id', async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "UPDATE transactions SET date=?, amount=?, description=? WHERE id=?",
                    values: [req.body.date, req.body.amount, req.body.description, req.params.id]
                });

                if (data.affectedRows) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ message: "Transaction rightfully changed" });
                } else {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: "No transaction found for the provided ID" });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    #getTotalTransaction() {
        this.#app.get('/transactions/total/:user_id', async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(amount) AS totalAmount FROM transactions WHERE user_id=?",
                    values: [req.params.user_id]
                });

                if (data[0].totalAmount !== null) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ totalAmount: data[0].totalAmount });
                } else {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: "No transactions found for the provided user ID" });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    #getBestDate() {
        this.#app.get('/transactions/maxAmountDate/:user_id', async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT date FROM transactions WHERE user_id=? ORDER BY amount DESC LIMIT 1",
                    values: [req.params.user_id]
                });

                if (data.length > 0) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ bestDate: data[0].date });
                } else {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: "No transactions found for the provided user ID" });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }



}

module.exports = TransactionsRoutes;