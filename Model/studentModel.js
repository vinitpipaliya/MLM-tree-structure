const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 25,
            required: true
        },
        ref: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student"
        }
    },
)

module.exports = mongoose.model("student", studentSchema)