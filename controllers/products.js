const Product = require("../models/product")

async function getAllProducts (req, res, next) {
    let {name, company, featured, sort, fields, numericFilters} = req.query
    let query = {}
    if (name) {
        query.name = { $regex: `${name}`, $options: 'i' }
    }
    if (company) {
        query.company = company
    }
    console.log(featured)
    if (featured) {
        query.featured = featured
    }
    console.log(req.query)
    let result = Product.find(query)
    if (sort) {
        const conSort = sort.replace(",", " ")
        console.log("conSort", conSort)
        result = result.sort(`${conSort}`)
    }
    if (fields) {
        const conSort = fields.replace(",", " ")
        console.log(conSort)
        result = result.select(`${conSort}`)
    }
    // page logic
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    //operators
    let moreLessArr = []
    let queryObject = {}
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }

        console.log(typeof(numericFilters))
        console.log(numericFilters)
        if (typeof(numericFilters) === "object"){
            console.log("Run only if Array", numericFilters)
            const joined = numericFilters.join(',')
            console.log("joined", typeof(joined))
            if ((joined.match(/price/g) || []).length === 2) {
                console.log("2 price passed")
                const priceArr = numericFilters.filter((item) => {
                    return (item.includes('price'))
                })
                const priceStr = priceArr.join(',')
                const regEx = /\b(<|>|>=|<=|=)\b/g
                let filters = priceStr.replace(regEx, (match) => `-${operatorMap[match]}-`)
                console.log("priceString", filters)
                filters.split(',').forEach((item) => {
                    const [term, operator, amount] = item.split('-')
                    if (operator == "$gt") {
                        moreLessArr[0] = `${term}`
                        moreLessArr[1] = amount
                    }
                    else {
                        moreLessArr[2] = `${term}`
                        moreLessArr[3] = amount
                    }
                })
                numericFilters = numericFilters.filter((item) => {
                    return !(item.includes('price'))
                })
                if (numericFilters.length > 0) {
                    numericFilters = numericFilters.join(',')
                }
                else {
                    numericFilters = null
                }
                console.log(numericFilters)
            }
            else {
                numericFilters = joined
            }
        }
        if (numericFilters) {
            const regEx = /\b(<|>|>=|<=|=)\b/g
            let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
            const options = ["price", "ratings"]
            filters.split(",").forEach((item) => {
                console.log(item)
                const params = item.split('-')
                const [term, operator, amount] = params
                console.log(term, operator, amount)
                queryObject[term]= {[operator]: Number(amount)}
                console.log(queryObject)
            })
        }
        // if (numericFilters.includes)
    }
    console.log("last call", queryObject)
    let products
    if (moreLessArr.length > 0) {
        products = await result.skip(skip).limit(limit).find(queryObject).gt(`${moreLessArr[0]}`, moreLessArr[1]).lt(`${moreLessArr[2]}`, moreLessArr[3])
    }
    else {
        products = await result.skip(skip).limit(limit).find(queryObject)
    }
    res.json({products, noOfHits: products.length, total: result.length, page: req.query.page || 1})
}

async function getAllProductsStatic (req, res, next) {
    const result = await Product.find({}).gt("price", 100).lt("price", 150)
    res.json({result, noOfHits: result.length})
}

module.exports = {getAllProducts, getAllProductsStatic}