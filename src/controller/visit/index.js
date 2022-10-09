const visitSchema = require("../../schema/visit")
const jwt = require('jsonwebtoken')

const createVisit = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
        const addVisit = new visitSchema(req.body)
        addVisit.save()
    })

}
const getVisit = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await visitSchema.findOne({ userId: { $in: _id } }).then((data) => {
            res.status(200).send({
                data
            })
        })

    })

}





module.exports = { createVisit, getVisit }
