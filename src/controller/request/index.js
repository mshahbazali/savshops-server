const requestSchema = require("../../schema/request")
const visitSchema = require("../../schema/visit")
const jwt = require('jsonwebtoken')

const createRequest = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
        req.body.status = "Pending"
        const createRequest = new requestSchema(req.body)
        createRequest.save().then(() => {
            res.status(201).send({
                message: "Request successfully sended"
            })
        })
    })
}
const getRequest = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await requestSchema.find({ userId: { $in: _id } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    })
}


const getBrand = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await visitSchema.find({ userId: { $in: _id } }).then((data) => {
            const allBrand = data.map(visit => { return visit.brandName })
            res.status(200).send({
                data: allBrand
            })
        })
    })

}



module.exports = { createRequest, getRequest, getBrand }
