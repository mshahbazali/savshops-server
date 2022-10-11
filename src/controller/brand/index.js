const brandSchema = require("../../schema/brand")
const categorySchema = require("../../schema/category")



const createBrand = async (req, res) => {
    const { key } = req.headers
    if (key == process.env.key_Brand) {
        await categorySchema.findOne({ name: req.body.category }).then(async (category) => {
            await categorySchema.findOneAndUpdate({ name: category.name }, { totalBrand: category.totalBrand + 1 }).then(() => {
                req.body.status = "Active"
                const createBrand = new brandSchema(req.body)
                createBrand.save().then((brand) => {
                    res.status(200).send({
                        message: "Brand successfully created",
                        brand
                    })
                })
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }

}




const getAllBrand = async (req, res) => {
    const { key } = req.headers
    if (key == process.env.key_Brand) {
        await brandSchema.find({ status: { $in: "Active" } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }

}

const getBrand = async (req, res) => {
    const { key, name } = req.headers
    if (key == process.env.key_Brand) {
        await brandSchema.find({ category: { $in: name } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}
const deleteBrand = async (req, res) => {
    const { key } = req.headers
    const { name } = req.body
    if (key == process.env.key_Brand) {
        await brandSchema.findOne({ name: name }).then(async (brand) => {
            if (brand == null) {
                res.status(200).send({
                    message: "This brand is not registered"
                })
            }
            else {
                await categorySchema.findOne({ name: brand.category }).then(async (category) => {
                    await categorySchema.findOneAndUpdate({ name: category.name }, { totalBrand: category.totalBrand - 1 }).then(async () => {
                        await brandSchema.findOneAndDelete({ name: name }).then((data) => {
                            res.status(200).send({
                                data
                            })
                        })
                    })
                })
            }

        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}
const updateBrand = async (req, res) => {
    const { key } = req.headers
    const { name } = req.body
    if (key == process.env.key_Brand) {
        await brandSchema.findOneAndUpdate({ name: name }, req.body, { new: true }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}

const getBrandData = async (req, res) => {
    const { key, name } = req.headers
    if (key == process.env.key_Brand) {
        await brandSchema.find({ name: { $in: name } }).then((data) => {
            res.status(200).send({
                data
            })
        })
    }
    else {
        res.status(201).send({
            error: "key is not valid"
        })
    }
}


module.exports = { getBrandData, createBrand, getAllBrand, getBrand, updateBrand, deleteBrand }
