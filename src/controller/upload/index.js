const fs = require("fs")
const ImageKit = require("imagekit");
const upload = async (req, res) => {
    var imagekit = new ImageKit({
        publicKey: process.env.imageKitPub,
        privateKey: process.env.imageKitPri,
        urlEndpoint: process.env.imageKitUrl
    });

    fs.readFile(`../../../${req.file.path}`, function (err, data) {
        if (err) console.log(err);; // Fail if the file can't be read.
        imagekit.upload({
            file: data,
            fileName: "savshops_profile_73581278",
        }, async function (error, result) {
            if (error) console.log(error);
            else {
                res.status(200).send({
                    url: result.url
                });
                fs.unlinkSync(`../../../${req.file.path}`)
            }
        });
    });
}


module.exports = { upload }