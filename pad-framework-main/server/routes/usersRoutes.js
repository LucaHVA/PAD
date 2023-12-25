/**
 * This class contains ExpressJS routes specific for the users entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */
class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#login()
        this.#getUserId()
    }

    /**
     * Checks if passed username and password are found in db, if so let the front-end know
     * @private
     */
    #login() {
        this.#app.post("/users/login", async (req, res) => {
            const username = req.body.username;

            //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
            const password = req.body.password;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT username, password, FROM users WHERE username = ? AND password = ?",
                    values: [username, password]
                });

                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    //return just the username for now, never send password back!
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"username": data[0].username
                    });
                } else {
                    //wrong username s
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong username or password"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
    #getUserId(){
        this.#app.get("/users/:username",async (req, res)=>{
                const username=req.params.username
                try {
                    const userId=await this.#databaseHelper.handleQuery({
                        query: "SELECT id FROM users WHERE username =?",
                        values:[username]
                    });
                    if (userId.length===1){
                        res.status(this.#errorCodes.HTTP_OK_CODE).json({id:userId[0].id})

                    } else{
                        res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Invalid User ID"});
                    }
                }catch (e){
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});

                }

            }
        ) }


}

module.exports = UsersRoutes