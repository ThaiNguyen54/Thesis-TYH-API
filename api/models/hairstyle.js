import mongoose from 'mongoose'

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
        required: true
    }
}, {
    collection: 'HairStyle',
    versionKey: false
})

const hairstyle = mongoose.model('HairStyle', HairStyleSchema)
export default hairstyle
