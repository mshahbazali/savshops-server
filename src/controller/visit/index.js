const visitSchema = require("../../schema/visit")
const jwt = require('jsonwebtoken')

const createVisit = async (req, res) => {
    const { brandName } = req.body
    req.body.userId = req.id
    await visitSchema.findOne({ brandName: brandName }).then((brand) => {
        if (brand) {
            res.status(201).send({
                message: "Brand Already Added"
            })
        }
        else {
            const addVisit = new visitSchema(req.body)
            addVisit.save().then(() => {
                res.status(201).send({
                    message: "Brand Added"
                })
            })
        }
    })

}
const getVisit = async (req, res) => {
    await visitSchema.find({ userId: { $in: req.id } }).then((data) => {
        res.status(200).send({
            data
        })
    })

}





module.exports = { createVisit, getVisit }
