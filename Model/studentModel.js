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


// For AutoPopulate use hooks
function autoPopulateref(next) {
    this.populate('ref');
    next();
}


studentSchema
    .pre('findOne', autoPopulateref)
    .pre('find', autoPopulateref);

module.exports = mongoose.model("student", studentSchema)