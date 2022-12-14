const withdrewSchema = require("../../schema/withdrew")
const { authSchema } = require("../../schema/auth")
const jwt = require('jsonwebtoken')
const notificationSchema = require("../../schema/notification")
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(process.env.OSAPPID, process.env.OSAPIKEY);

const create = async (req, res) => {
        req.body.userId = req.id
        req.body.status = "Pending"
        const createWithdrew = new withdrewSchema(req.body)
        createWithdrew.save().then(() => {
            res.status(201).send({
                message: "Withdrew request successfully sended"
            })
        })
}
const get = async (req, res) => {
        await withdrewSchema.find({ userId: { $in: req.id } }).then((data) => {
            res.status(200).send({
                data
            })
        })
}


const approve = async (req, res) => {
    const { withdrewId } = req.body
    await withdrewSchema.findOneAndUpdate({ _id: withdrewId }, { status: "Completed" }, { new: true }).then(async (doc) => {
        if (doc) {
            await authSchema.findById({ _id: doc.userId }).then(async (data) => {
                await authSchema.findOneAndUpdate({ _id: data._id.toString() }, { totalEarning: data.totalEarning - doc.amount }, { new: true }, (err, data) => {
                    if (!err) {
                        const notification = {
                            headings: { "en": "Withdrew successfully completed", },
                            contents: {
                                'en': "Withdrew successfully completed",
                            },
                            include_external_user_ids: [doc.userId],
                        };
                        const createNotification = new notificationSchema({ title: `${doc.amount} usd withdrew completed`, content: "Withdrew successfully completed", status: "Completed", userId: doc.userId, type: "withdrew" })
                        createNotification.save().then(async () => {
                            await client.createNotification(notification)
                            res.status(200).send({
                                message: "Withdrew successfully completed",
                                data: doc
                            })
                        })
                    }
                    else {
                        console.log(err);
                    }
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
const reject = async (req, res) => {
    const { withdrewId } = req.body
    await withdrewSchema.findByIdAndUpdate({ _id: withdrewId }, { status: "Rejected" }, { new: true }).then((doc) => {
        if (doc) {
            const notification = {
                headings: { "en": "Withdrew request rejected", },
                contents: {
                    'en': "Withdrew request rejected",
                },
                include_external_user_ids: [doc.userId],
            };
            const createNotification = new notificationSchema({ title: `${doc.amount} usd withdrew rejected`, content: "Withdrew request rejected", status: "Completed", userId: doc.userId, type: "withdrew" })
            createNotification.save().then(async () => {
                await client.createNotification(notification)
                res.status(200).send({
                    message: "Withdrew successfully rejected",
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




module.exports = { reject, approve, create, get }
