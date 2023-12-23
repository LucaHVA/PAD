/**
 * Routes file for transactions entity
 * @author Luca Rijkbost
 */

class TransactionsRoutes{
#app
    #databaseHelper= require("../framework/utils/databaseHelper")
    #httpErrorCodes=require("../framework/utils/httpErrorCodes")
    constructor(app) {
        this.#app=app
        this.#createTransaction();
    }

  #createTransaction(){
    this.#app.post("/transactions", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO transactions(amount, description, date) VALUES (?,?,?)",
                    values: [req.body.amount, req.body.description, req.body.date]
                });
                if (data.insertId){
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId})
                }
            } catch (e) {
              res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        }
    )}
}

module.exports=TransactionsRoutes;