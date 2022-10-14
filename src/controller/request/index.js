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

const approve = async (req, res) => {
    const { requestId, key } = req.headers
    if (key == process.env.key_Brand) {
        await requestSchema.findByIdAndUpdate({ _id: requestId }, { status: "Approved" }, { new: true }, (err, doc) => {
            if (err) {
                res.status(200).send({
                    message: "Something Wrong",
                    err: err.message
                })
            }
            else {
                res.status(200).send({
                    message: "Request successfully approved",
                    data: doc
                })
            }

        })
    }
    else {
        res.status(200).send({
            message: "Key is not valid"
        })
    }

}


const reject = async (req, res) => {
    const { requestId, key } = req.headers
    if (key == process.env.key_Brand) {
        await requestSchema.findByIdAndUpdate({ _id: requestId }, { status: "Rejected" }, { new: true }, (err, doc) => {
            if (err) {
                res.status(200).send({
                    message: "Something Wrong",
                    err: err.message
                })
            }
            else {
                res.status(200).send({
                    message: "Request successfully rejected",
                    data: doc
                })
            }

        })
    }
    else {
        res.status(200).send({
            message: "Key is not valid"
        })
    }
}


module.exports = { approve, reject, createRequest, getRequest, getBrand }
