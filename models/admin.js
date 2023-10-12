import mongoose from "mongoose";

const AdminDBSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
}, {
    collection: "Admin",
    versionKey: false
})

const admin = mongoose.model('Admin', AdminDBSchema)
export default admin