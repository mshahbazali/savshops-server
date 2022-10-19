const categorySchema = require("../../schema/category")


const createCategory = async (req, res) => {
    req.body.totalBrand = 0
    req.body.status = "Active"
    const createCategory = new categorySchema(req.body)
    createCategory.save().then((category) => {
        res.status(200).send({
            message: "Category successfully created",
            category
        })
    })
}
const getCategory = async (req, res) => {
    const { name } = req.headers
    await categorySchema.find({ name: { $in: name } }).then((data) => {
        res.status(200).send({
            data
        })
    })
}


const getAllCategory = async (req, res) => {
    await categorySchema.find({ status: { $in: "Active" } }).then((data) => {
        res.status(200).send({
            data
        })
    })
}

const deleteCategory = async (req, res) => {
    const { name } = req.body
    await categorySchema.findOneAndDelete({ name: name }).then((data) => {
        res.status(200).send({
            data
        })
    })
}

const updateCategory = async (req, res) => {
    const { name } = req.body
    await categorySchema.findOneAndUpdate({ name: name }, req.body, { new: true }).then((data) => {
        res.status(200).send({
            data
        })
    })
}




module.exports = { createCategory, getAllCategory, getCategory, updateCategory, deleteCategory }
