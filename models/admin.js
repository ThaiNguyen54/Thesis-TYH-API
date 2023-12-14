import mongoose from "mongoose";
import {ROLE} from "../configs/Global.js";

const AdminDBSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: Number,
        default: ROLE.ADMIN
    },
    DisplayName: {
        type: String,
        required: true
    },
    AvatarUrl: {
        type: String
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: "Admin",
    versionKey: false
})

const admin = mongoose.model('Admin', AdminDBSchema)
export default admin