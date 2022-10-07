const categorySchema = require("../../schema/category")


const createCategory = async (req, res) => {
    const { key } = req.headers
    req.body.totalBrand = 0
    req.body.status = "Active"
    if (key == process.env.key_Brand) {
        const createCategory = new categorySchema(req.body)
        createCategory.save().then((category) => {
            res.status(200).send({
                message: "Category successfully created",
                category
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}
const getCategory = async (req, res) => {
    const { key, name } = req.headers
    if (key == process.env.key_Brand) {
        await categorySchema.find({ name: { $in: name } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}

const getAllCategory = async (req, res) => {
    const { key } = req.headers
    if (key == process.env.key_Brand) {
        await categorySchema.find({ status: { $in: "Active" } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}
const deleteCategory = async (req, res) => {
    const { key } = req.headers
    const { name } = req.body
    if (key == process.env.key_Brand) {
        await categorySchema.findOneAndDelete({ name: name }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}
const updateCategory = async (req, res) => {
    const { key } = req.headers
    const { name } = req.body
    if (key == process.env.key_Brand) {
        await categorySchema.findOneAndUpdate({ name: name }, req.body, { new: true }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}




module.exports = { createCategory, getAllCategory, getCategory, updateCategory, deleteCategory }
