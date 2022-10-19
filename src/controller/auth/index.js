const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { authSchema, otpSchema } = require("../../schema/auth")
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_HASH
    }
}));




const admin = async (req, res) => {
    await authSchema.find({}).then((data) => {
        res.status(200).send({
            data
        })
    })

}

// Check Auth User 

const check = async (req, res) => {
    const { email } = req.body
    const user = await authSchema.findOne({ email })
    if (user) {
        console.log(user)
        res.status(201).send({
            message: "User Already Register"
        })
    }
    else {
        res.status(201).send({
            message: "User Not Register"
        })
    }
}

// Sign Up Controller 
const signup = async (req, res) => {
    try {
        const { referralCode } = req.body
        let user = await authSchema.findOne({ email: req.body.email });
        if (user) {
            return res.send('That user already exisits!');
        } else {
            const referralUser = await authSchema.findOne({ referralCode })
            const hash = await bcrypt.hash(req.body.password, Number(process.env.HASH))
            req.body.referralCode = await req.body.email.substring(0, req.body.email.indexOf("@"));
            req.body.password = hash
            req.body.totalreferral = 0
            req.body.lifeTimeEarning = 0
            req.body.totalEarning = 0
            req.body.pendingEarning = 0
            const addauth = new authSchema(req.body)
            addauth.save().then(async (user) => {
                const token = await jwt.sign(user._id.toString(), process.env.JWT_KEY)
                res.status(200).send({
                    authMessage: "Your account was created successfully!",
                    token: token
                });
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
// Sign In Controller 
const signin = async (req, res) => {
    try {
        const { email } = req.body
        await authSchema.findOne({ email: email })
            .then(async (user) => {
                if (!user) {
                    res.status(202).send({
                        message: "Email not register"
                    })
                }
                else {
                    await bcrypt.compare(req.body.password, user.password).then(async (pass) => {
                        console.log(pass);
                        if (pass) {
                            const token = await jwt.sign(user._id.toString(), process.env.JWT_KEY)
                            res.status(201).send({
                                message: "Account successfully logged",
                                token: token,
                                userId: user._id.toString(),
                                user: user
                            })
                        }
                        else {
                            res.status(201).send({
                                message: "Wrong Password",
                            })
                        }
                    })

                }
            })
            .catch(err => {
                console.log(err);
                res.status(201).send({ message: "User Not Found", user: 'false' })
            })
    }
    catch (e) {
        res.status(201).send({ message: "User Not Found", user: 'false' })
    }

}

// Update Password Controller 
const updatepassword = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, Number(process.env.HASH))
        await authSchema.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } }, { new: true }).then((user) => {
            if (user) {
                res.status(201).send({
                    message: "Your password updated",
                    user: user
                })
            }
            else {
                res.status(201).send({
                    message: "Something wrong",
                })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}

// Update Profile Controller 
const updateprofile = async (req, res) => {
    try {
        await authSchema.findByIdAndUpdate({ _id: req.id }, req.body, { new: true }).then((user) => {
            if (!user) {
                res.status(201).send({
                    message: "Something wrong",
                })
            }
            else {
                res.status(201).send({
                    message: "Your profile updated",
                    user: user
                })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}

// Send Otp Controller 
const sendotp = async (req, res) => {
    const { email, purpose } = req.body
    const randomNumber = 100000 + Math.floor(Math.random() * 899999)
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Sending Email using Node.js[nodemailer]',
        text: `OTP is ${randomNumber}`
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    const data = {
        email: email,
        OTP: randomNumber,
        purpose: purpose == 0 ? "Sign Up" : "Forgot Password"
    }

    const addOtp = await otpSchema(data)
    addOtp.save().then((message) => {
        res.status(201).send({
            message: "OTP SENDED"
        })
    })
}
// Check Otp Controller
const checkotp = async (req, res) => {
    try {
        const { OTP } = req.body
        await otpSchema.findOne({ OTP: OTP })
            .then(async (user) => {
                if (!user) {
                    res.status(202).send({
                        message: "Wrong OTP"
                    })
                }
                else {
                    let expireTime = 10 * 60 * 1000
                    let timeDifference = new Date().getTime() - new Date(user.createdAt).getTime()
                    if (timeDifference > expireTime) {
                        res.status(201).send({
                            message: "OTP EXPIRED"
                        })
                    }
                    else {
                        res.status(201).send({
                            message: "OTP VALID"
                        })
                    }
                }
            })
            .catch(err => {
                res.status(201).send({ message: "User Not Found", user: 'false' })
            })
    }
    catch (e) {
        res.status(201).send({ message: "User Not Found", user: 'false' })
    }
}
// Delete User Controller
const deleteuser = async (req, res) => {
    try {
        await authSchema.findOneAndDelete({ email: req.body.email }).then(async (doc) => {
            res.status(201).send({
                message: "Your account was deleted successfully!",
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    catch (err) {
        console.log(err)
    }
}

const me = async (req, res) => {
    await authSchema.findById({ _id: req.id }).then((user) => {
        if (user) {
            res.status(201).send({
                user: user
            })
        }
        else {
            res.status(201).send({
                message: "User Not Register"
            })
        }
    })
}

module.exports = { admin, me, check, signup, signin, updatepassword, sendotp, checkotp, updateprofile, deleteuser }



