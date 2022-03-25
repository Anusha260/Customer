const mongoose = require("mongoose")
const config = require("config")
const db = "mongodb+srv://Nanabalaanusha:Anusha26@cluster0.tweuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongoDB connected.....")

    } catch (err) {
        console.error(err.message)
            // exit process with failure
        process.exit(1)
    }
}
module.exports = connectDB;