const withdrewSchema = require("../../schema/withdrew")
const jwt = require('jsonwebtoken')

const create = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
        const createWithdrew = new withdrewSchema(req.body)
        createWithdrew.save().then(() => {
            res.status(201).send({
                message: "Withdrew request successfully sended"
            })
        })
    })

}
const get = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await withdrewSchema.find({ userId: { $in: _id } }).then((data) => {
            res.status(200).send({
                data
            })
        })

    })

}





module.exports = { create, get }
