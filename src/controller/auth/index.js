const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { google } = require('googleapis')
const fs = require("fs")
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
        const { referralCode, email } = req.body
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
                    res.status(202).send("User Not Found")
                }
                else {
                    await bcrypt.compare(req.body.password, user.password).then(async (pass) => {
                        if (pass) {
                            const token = await jwt.sign(user._id.toString(), process.env.JWT_KEY)
                            res.status(201).send({
                                message: "user logged",
                                token: token
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
                res.status(201).send({ message: "User Not Found", user: 'false' })
            })
    }
    catch (e) {
        res.status(201).send({ message: "User Not Found", user: 'false' })
    }

}
// Forgot Password Controller 
const forgotpassword = async (req, res) => {
    const { email, purpose } = req.body
    if (purpose == 0) {
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
}
// Update Password Controller 
const updatepassword = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, Number(process.env.HASH))
        await authSchema.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } }, { new: true }, (err, user) => {
            if (err) {
                res.status(201).send({
                    message: "Something wrong",
                })
            }
            else {
                res.status(201).send({
                    message: "Your password updated",
                    user: user
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
        const { token } = req.headers
        await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
            await authSchema.findByIdAndUpdate({ _id }, req.body, { new: true }, (err, user) => {
                if (err) {
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
                    res.status(202).send("Wrong OTP")
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

const upload = (req, res) => {
    try {
        console.log(req.file);
        const oauth2Client = new google.auth.OAuth2(
            "832638247811-hava2blgf6heqep137q0h1mgpnp362h3.apps.googleusercontent.com",
            "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",
            "https://developers.google.com/oauthplayground"
        );
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const fileMetadata = {
            name: req.file.filename,
        };
        const media = {
            mimeType: req.file.type,
            body: fs.createReadStream(req.file.path),
        };
        oauth2Client.setCredentials({
            access_token: 'ya29.A0AVA9y1tlH3C4oej6EQ5G8Tp2Msyn6I31vdi0qBHjijsa2ys355mZw9WV43kbqknQrOjUW8Xgq5cVXtMws_G9C-3uFiKG7slzcODD-dEb_apB_W7m0pxNh_VSGOCE_9aooBofjtJXwWr8lY389nU1GlAyVE1vYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4cUhCWjZFUmNlWDJkdTdjU0J6OGNyUQ0163',
            refresh_token: '1//04dLeLg6thapbCgYIARAAGAQSNwF-L9IrwffYNZu0VIdpbTgXmNY_zcHtAkY4ReGeZtznDMIwEcaRY0_KupmDdm6iefXff7vpTyQ',
            expiry_date: true
        });
        drive.files.create(
            {
                resource: fileMetadata,
                media: media,
                fields: 'id',
            },
            async (err, file) => {
                await drive.permissions.create({
                    fileId: file.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                })
                const result = await drive.files.get({
                    fileId: file.data.id,
                    fields: "webViewLink , webContentLink",
                });
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    fs.unlinkSync(req.file.path);
                    console.log(file.data.id)
                    res.status(200).send({ fileId: file.data.id });
                }
            }
        );

        // res.send({ "hello": "resFile.data" })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

const me = async (req, res) => {
    const { token } = req.headers
    await jwt.verify(token, process.env.JWT_KEY, async (err, _id) => {
        const user = await authSchema.findById({ _id })
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

module.exports = { me, check, signup, signin, forgotpassword, updatepassword, sendotp, checkotp, updateprofile, deleteuser, upload }



