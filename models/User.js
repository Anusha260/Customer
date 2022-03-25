const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Phonenumber: {
        type: Number,
        require: true

    },
    Username: {
        type: String,
        require: true,
        unique: true

    },

    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        require: true
    },
    confirmphonenumber: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model("user", userSchema)
module.exports = User;