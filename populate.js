const mongoose = require('mongoose')
const connectDb = require('./db/connect')
const Product = require("./models/product")
const products = require("./products.json")
require('dotenv').config()

let db
async function start() {
    try {
        db = await mongoose.connect(`mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@sandbox.umh18rg.mongodb.net/04-store-api?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
          })
        } catch (err) {
        console.log(err)
    }
    Product.insertMany(products)
    console.log(products.length)
    console.log("done")
}

start()