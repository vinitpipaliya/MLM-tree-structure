const studentModel = require("../Model/studentModel")

exports.insertData = (req, res) => {
    try {
        const data = req.body
        const stuMod = new studentModel(data)
        stuMod.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to save in database " + err
                })
            }
            else {
                return res.status(200).send({
                    message: "Successfully inserted."
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}

exports.getData = async (req, res) => {
    try {
        var docs = await studentModel.find(res).exec();
        var list = []
        for (let i = 0; i < docs.length; i++) {
            for (let j = 0; j < docs.length; j++) {
                if (docs[i].ref.equals(docs[j]._id)) {
                    list.push(docs[j])
                }
            }
        }
        return res.json({
            data: list
        })
    }
    catch (err) {
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}