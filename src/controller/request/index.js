const requestSchema = require("../../schema/request")
const visitSchema = require("../../schema/visit")
const { authSchema } = require("../../schema/auth")
const jwt = require('jsonwebtoken')
const OneSignal = require('onesignal-node');
const notificationSchema = require("../../schema/notification")
const client = new OneSignal.Client(process.env.OSAPPID, process.env.OSAPIKEY);
const createRequest = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        req.body.userId = _id
        req.body.status = "Pending"
        console.log(req.body);
        const createRequest = new requestSchema(req.body)
        createRequest.save().then(async (doc) => {
            try {
                await authSchema.findById({ _id: doc.userId }).then(async (data) => {
                    await authSchema.findOneAndUpdate({ _id: data._id.toString() }, { pendingEarning: data.pendingEarning + doc.amount }, { new: true }, (err, data) => {
                        if (!err) {
                            res.status(201).send({
                                message: "Request successfully sended"
                            })
                        }
                        else {
                            console.log(err);
                        }
                    })

                })
            } catch (error) {
                console.log(error);
            }



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
        await requestSchema.findByIdAndUpdate({ _id: requestId }, { status: "Approved" }, { new: true }, async (err, doc) => {
            if (err) {
                res.status(200).send({
                    message: "Something Wrong",
                    err: err.message
                })
            }
            else {
                try {
                    await authSchema.findById({ _id: doc.userId }).then(async (data) => {
                        await authSchema.findOneAndUpdate({ _id: data._id.toString() }, { totalEarning: data.totalEarning + doc.amount, lifeTimeEarning: data.lifeTimeEarning + doc.amount }, { new: true }, (err, data) => {
                            if (!err) {
                                const notification = {
                                    headings: { "en": "Request approved", },
                                    contents: {
                                        'en': "Cashback Request successfully approved",
                                    },
                                    include_external_user_ids: [doc.userId],
                                };
                                const createNotification = new notificationSchema({ title: `Request approved`, content: "Cashback Request successfully approved", status: "Completed", userId: doc.userId, type: "request" })
                                createNotification.save().then(async () => {
                                    await client.createNotification(notification)
                                    res.status(200).send({
                                        message: "Request successfully approved",
                                        data: doc
                                    })
                                })
                            }
                            else {
                                console.log(err);
                            }
                        })

                    })

                } catch (error) {

                }




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
                const notification = {
                    headings: { "en": "Request rejected", },
                    contents: {
                        'en': "Cashback Request rejected",
                    },
                    include_external_user_ids: [doc.userId],
                };
                const createNotification = new notificationSchema({ title: `Request rejected`, content: "Cashback Request rejected", status: "Completed", userId: doc.userId, type: "request" })
                createNotification.save().then(async () => {
                    await client.createNotification(notification)
                    res.status(200).send({
                        message: "Request successfully rejected",
                        data: doc
                    })
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
