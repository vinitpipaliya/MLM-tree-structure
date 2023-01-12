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
        var c = 0
        var list = []
        for (let j of mainList) {
            list = []
            for (let i of docs) {
                if (j._id.equals(i.ref)) {
                    list.push(i)
                }
            }
            j['newKey'] = list
            recursion(list)
        }
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


        function recursion(list) {
            c++
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
        console.log(c)
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

exports.getDataByQuary = (req, res) => {
    try {
        var mainList = studentModel.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "ref",
                    pipeline: [{ $project: { ref: 1, name: 1 } }, {
                        $lookup: {
                            from: "students",
                            localField: "_id",
                            foreignField: "ref",
                            as: "students",
                            pipeline: [{ $project: { ref: 1, name: 1 } }, {
                                $lookup: {
                                    from: "students",
                                    localField: "_id",
                                    foreignField: "ref",
                                    as: "students",
                                    pipeline: [{ $project: { ref: 1, name: 1 } },]
                                }
                            }]
                        }
                    }],
                    as: "students",
                }
            },
            {
                $project: {
                    name: 1,
                    ref: 1,
                    students: 1
                }
            },
            // {
            //     $group: {
            //         _id: {
            //             _id: "$students._id"
            //         },
            //         name: { $first: "$students.name" },
            //         ref: { $first: "$students.ref" },
            //         students: { $push: "$students" }
            //     }
            // },

        ]).
            exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        err: "Not able to aggeregate. " + err
                    })
                }
                else {
                    //Logic
                    var list = []
                    for (let i of data) {
                        if (i.ref == undefined) {
                            list.push(i)
                        }
                    }
                    for (let i of list) {
                        for (let k in i.students) {
                            for (let j of data) {
                                if (i.students[k]._id.equals(j._id)) {
                                    i.students[k] = Object.assign(j)
                                }
                            }
                            if (i.students[k].ref.equals(i._id)) {
                                i.students[k] = Object.assign(i.students[k])
                            }
                        }
                    }


                    return res.status(200).send({
                        DATA: list
                        // DATA: data
                    })
                }
            })
    }
    catch (err) {
        return res.status(400).json({
            err: "Problem :" + err
        })
    }
}

exports.getDataByChild = async (req, res) => {
    try {
        const { _id } = req.body
        // studentModel.findOne({ _id: _id })
        //     .exec((err, data) => {
        //         if (err) {
        //             console.log(err)
        //             return res.status(200).json({
        //                 err: err
        //             })
        //         }
        //         else {
        //             return res.status(200).json({
        //                 DATA: data
        //             })
        //         }
        //     })

        // studentModel.aggregate([
        //     {
        //         $match: {
        //             _id: mongoose.Types.ObjectId(_id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "students",
        //             localField: "ref",
        //             foreignField: "_id",
        //             as: "students",
        //             pipeline: [{ $project: { name: 1, ref: 1 } }]
        //         }
        //     }
        // ]).exec((err, data) => {
        //     if (err) {
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

        // studentModel.findOne({ _id: _id }).lean(true).exec(async (err, data) => {
        //     if (err) {
        //         return res.json({
        //             err: err
        //         })
        //     }
        //     else {
        //         console.log(data)
        //         var list = []
        //         var data1 = await studentModel.find().lean(true).exec()
        //         for (let i in data1) {
        //             if (data.ref.equals(data1[i]._id)) {
        //                 console.log("Krishna")
        //                 list.push(data)
        //                 data1[i]["new key"] = list
        //                 return res.json({
        //                     DATA: data1[i]
        //                 })
        //             }

        //         }

        //     }
        // })

        // var docs = await studentModel.findOne({ _id: _id }).lean(true).exec()
        // var data = await studentModel.find().lean(true).exec()
        // var list = []
        // for (let i in data) {
        //     if (docs.ref.equals(data[i]._id)) {
        //         data[i]['child'] = docs
        //         list.push(data[i])
        //         return res.json({
        //             DATA: list
        //         })
        //     }
        // }
        // for (let i in data) {
        //     if (list[0].ref.equals(data[i]._id)) {
        //         data[i]['child'] = list[0]
        //         list = []
        //         list.push(data[i])
        //         return res.json({
        //             DATA: list
        //         })
        //     }
        // }

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            err: err
        })
    }
}