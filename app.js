require("express-async-errors")
require('dotenv').config()

const express = require('express')
const app = express()
const connectDb = require("./db/connect")
// api route
const productsRoute = require("./routes/products")
//error
const errorHandlerMiddleware = require("./middleware/error-handler")
const notFoundMiddleware = require("./middleware/error-handler")
// using the package


// app.use(express.urlencoded({extended:false}));
app.use(express.json())

// app.get('/', (req, res, next) => {
//     res.send('<h1>Store api</h1><a href="api/v1/products">Products Api</a>')
// })

app.use("/api/v1/products", productsRoute)

app.use(express.static('public'))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.port || 3000

async function start() {
    try {
        connectDb(`mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@sandbox.umh18rg.mongodb.net/04-store-api?retryWrites=true&w=majority`)
        app.listen(port, console.log(`Listening at port: ${port}`))
    } catch (err) {
        console.log(err)
    }
}

start()

