const jwt = require('jsonwebtoken')
const auth = async (req, res, next) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        if (err) {
            res.status(200).send({
                message: "Auth token not valid"
            })
        }
        else {
            req.id = _id
            next()
        }
    })
}

module.exports = { auth }