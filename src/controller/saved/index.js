const savedSchema = require("../../schema/saved")
const jwt = require('jsonwebtoken')
const brandSchema = require("../../schema/brand")

const create = async (req, res) => {
    const { token } = req.headers
    const { brandId } = req.body
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
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
    })
}

const getAll = async (req, res) => {
    const { token, ids } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        console.log();
        await brandSchema.find({ _id: { $in: ids.split(",") } }).then((data) => {
            res.status(200).send({
                data
            })
        })

    })
}

const get = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await savedSchema.find({ userId: { $in: _id } }).then((data) => {
            const brandIds = data.map(brand => { return brand.brandId })
            res.status(200).send({
                brandIds
            })
        })

    })
}
const deleteSaved = async (req, res) => {
    const { token } = req.headers
    const { savedId } = req.body
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {


    })
}




module.exports = { getAll, deleteSaved, create, get }
