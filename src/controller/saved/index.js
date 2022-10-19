const savedSchema = require("../../schema/saved")
const jwt = require('jsonwebtoken')
const brandSchema = require("../../schema/brand")

const create = async (req, res) => {
    const { brandId } = req.body
    req.body.userId = req.id
    await savedSchema.findOne({ brandId: brandId.toString() }).then(async (brand) => {
        if (brand) {
            await savedSchema.findByIdAndDelete({ _id: brand._id.toString() }).then((data) => {
                res.status(200).send({
                    message: "Saved store successfully deleted"
                })
            })
        }
        else {
            const createSaved = new savedSchema(req.body)
            createSaved.save().then(() => {
                res.status(201).send({
                    message: "Store successfully saved"
                })
            })
        }
    })
}
const getAll = async (req, res) => {
    const { ids } = req.headers
    if (ids) {
        await brandSchema.find({ _id: { $in: ids.split(",") } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(200).send({
            data: []
        })
    }
}

const get = async (req, res) => {
    await savedSchema.find({ userId: { $in: req.id } }).then((data) => {
        const brandIds = data.map(brand => { return brand.brandId })
        res.status(200).send({
            brandIds
        })
    })
}




module.exports = { getAll, create, get }
