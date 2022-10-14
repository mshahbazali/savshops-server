const jwt = require('jsonwebtoken')
const notificationSchema = require("../../schema/notification")

const get = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        await notificationSchema.find({ userId: { $in: _id } }).then((data) => {
            res.status(200).send({
                data
            })
        })

    })
}




module.exports = { get }
