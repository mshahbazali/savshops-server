const jwt = require('jsonwebtoken')
const notificationSchema = require("../../schema/notification")

const get = async (req, res) => {
    await notificationSchema.find({ userId: { $in: req.id } }).then((data) => {
        res.status(200).send({
            data
        })
    })
}




module.exports = { get }
