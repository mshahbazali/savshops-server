const visitSchema = require("../../schema/visit")
const jwt = require('jsonwebtoken')

const createVisit = async (req, res) => {
    const { token } = req.headers
    const { brandName } = req.body
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
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

    })

}
const getVisit = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await visitSchema.find({ userId: { $in: _id } }).then((data) => {
            res.status(200).send({
                data
            })
        })

    })

}





module.exports = { createVisit, getVisit }
