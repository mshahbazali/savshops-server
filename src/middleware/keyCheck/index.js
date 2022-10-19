const keyCheck = (req, res, next) => {
    const { key } = req.headers
    if (key == process.env.key_Brand) {
        next()
    }
    else {
        res.status(200).send({
            message: "Key Not Valid"
        })
    }
}

module.exports = { keyCheck }