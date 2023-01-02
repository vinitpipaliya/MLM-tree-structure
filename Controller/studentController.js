const { populate } = require("../Model/studentModel")
const studentModel = require("../Model/studentModel")
const mongoose = require("mongoose")
mongoose.set('debug', true);
// mongoose.Promise = global.Promise;
// require('dotenv').config()

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
        // var docs = await studentModel.find(res).exec();

        // for (let i = 0; i < docs.length; i++) {
        //     var list = []
        //     for (let j = 0; j < docs.length; j++) {
        //         if (docs[i].ref != undefined) {
        //             if (docs[i]._id.equals(docs[j].ref)) {
        //                 list.push(docs[j])
        //             }
        //         }
        //     }
        //     docs[i] = { ...docs[i], "list": list }
        // }
        // return res.json({
        //     data: docs
        // })
        // studentModel.find().populate({
        //     path: "ref",
        //     model: "student",
        //     populate: {
        //         path: "ref",
        //         model: "student",
        //         populate: {
        //             path: "ref",
        //             model: "student"
        //         }
        //     }
        // }).exec((err, data) => {
        //     if (err) {
        //         console.log(err
        //         )
        //         return res.json({
        //             err: err
        //         })
        //     }
        //     else {
        //         return res.json({
        //             DATA: data
        //         })
        //     }
        // })


        // const conn = await mongoose.connect(process.env.URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }).then(() => {
        //     console.log("DB CONNECT")
        // }).catch(() => {
        //     console.log("ERROR IN CONNECTION.")
        // })
        // await Promise.all(
        //     Object.keys(conn.models).map(m => conn.models[m].remove({}))
        // );


        //AUTO POPULATE in mongoose. But it doesn't give tree structure 
        // await [].reduce((acc, ref) =>
        //     (ref === undefined) ? acc.then(() => studentModel.create({ ref }))
        //         : acc.then(child => studentModel.create({ ref, ref: [child] })),
        //     Promise.resolve()
        // );
        // let Student = await studentModel.findOne({ _id: "63b1d3599cb1adca0376f344" });
        // return res.send({
        //     DATA: Student
        // })

        //lean()--> Convert Mongoose Object Into simple Javascript Object.
        // var docs = await studentModel.find({}).exec();
        // let data = [];
        // for (let f of docs) {
        //     let obj = { 'main': f.name };
        //     let jj = await studentModel.find({ ref: f._id }, (err, res) => {
        //         if (err) {
        //             return
        //         }
        //     }).exec();

        //     data.push(obj);
        // }

        var docs = await studentModel.find().lean(true).exec();
        var mainList = []
        for (let i of docs) {
            if ((i.ref === undefined)) {
                mainList.push(i)
            }
        }
        var list = []
        for (let i of docs) {
            if (mainList[0]._id.equals(i.ref)) {
                list.push(i)
            }
        }
        mainList[0]['newKey'] = list
        // var mainList2 = list
        // for (let j of mainList2) {
        //     list = []
        //     for (let i of docs) {
        //         if (j._id.equals(i.ref)) {
        //             list.push(i)
        //         }
        //         j['newKey'] = list
        //     }
        // }
        recursion(list)

        function recursion(list) {
            var mainList2 = list
            for (let j of mainList2) {
                list = []
                for (let i of docs) {
                    if (j._id.equals(i.ref)) {
                        list.push(i)
                        recursion(list)
                    }
                    j['newKey'] = list
                }
            }
        }

        return res.status(200).json({
            DATA: mainList
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}
