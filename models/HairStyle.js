import mongoose from 'mongoose'
import {INTEGER} from "sequelize";

let Schema = mongoose.Schema
const HairStyleSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Url: {
        type: String,
        required: true
    },
    Des: {
        type: String,
    },
    Trending: {
        type: Number
    },
    Celeb: {
        type: String
    },
    Category: {
        type: String
    },
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    },
    CreatedBy: {
        type: Schema.Types.ObjectId
    },
    UpdatedBy: {
        type: Schema.Types.ObjectId
    }
}, {
    collection: 'HairStyle',
    versionKey: false
})

const hairstyle = mongoose.model('HairStyle', HairStyleSchema)
export default hairstyle
