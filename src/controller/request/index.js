const requestSchema = require("../../schema/request")
const visitSchema = require("../../schema/visit")
const { authSchema } = require("../../schema/auth")
const jwt = require('jsonwebtoken')
const OneSignal = require('onesignal-node');
const notificationSchema = require("../../schema/notification")
const client = new OneSignal.Client(process.env.OSAPPID, process.env.OSAPIKEY);
const createRequest = async (req, res) => {
    req.body.userId = req.id
    req.body.status = "Pending"
    const createRequest = new requestSchema(req.body)
    createRequest.save().then(async (doc) => {
        try {
            await authSchema.findById({ _id: doc.userId }).then(async (data) => {
                await authSchema.findOneAndUpdate({ _id: data._id.toString() }, { pendingEarning: data.pendingEarning + doc.purchaseAmount }, { new: true }, (err, data) => {
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
}
const getRequest = async (req, res) => {
    await requestSchema.find({ userId: { $in: req.id } }).then((data) => {
        res.status(200).send({
            data
        })
    })
}


const getBrand = async (req, res) => {
    await visitSchema.find({ userId: { $in: req.id } }).then((data) => {
        const allBrand = data.map(visit => { return visit.brandName })
        res.status(200).send({
            data: allBrand
        })
    })
}

const approve = async (req, res) => {
    const { requestId } = req.body
    if (requestId) {
        await requestSchema.findByIdAndUpdate({ _id: requestId }, { status: "Approved" }, { new: true }).then(async (doc) => {
            await authSchema.findById({ _id: doc.userId }).then(async (data) => {
                await authSchema.findOneAndUpdate({ _id: data._id.toString() }, {
                    totalEarning: data.totalEarning + doc.purchaseAmount,
                    lifeTimeEarning: data.lifeTimeEarning + doc.purchaseAmount,
                    pendingEarning: data.pendingEarning - doc.purchaseAmount
                }, { new: true })
                    .then((data) => {
                        if (data) {
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
        })
    }
    else {
        res.status(200).send({
            message: "Request id not found"
        })
    }
}


const reject = async (req, res) => {
    const { requestId } = req.body
    await requestSchema.findByIdAndUpdate({ _id: requestId }, { status: "Rejected" }, { new: true }).then(
        (doc) => {
            if (doc) {
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
            else {
                res.status(200).send({
                    message: "Something Wrong",
                })
            }

        })
}


module.exports = { approve, reject, createRequest, getRequest, getBrand }
