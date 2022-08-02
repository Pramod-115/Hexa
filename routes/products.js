const express = require('express')
const router = express.Router()
const {getAllProducts, getAllProductsStatic} = require("../controllers/products")
const errorMiddleware = require("../middleware/error-handler")

router.get('/', getAllProducts)
router.get('/static', getAllProductsStatic)

router.use(errorMiddleware)

module.exports = router