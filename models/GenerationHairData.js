import mongoose from 'mongoose'

let Schema = mongoose.Schema
const GenerationHairStyleSchema = new mongoose.Schema({
    GeneratedImageURL: {
        type: String,
        required: true
    },
    HairstyleName: {
        type: String,
        required: true
    },
    ImageBase64: {
        type: String,
        required: true
    },
    ImageName: {
        type: String,
        required: true
    },
    RegistrationToken:{
        type: String,
        required: true
    }
}, {
    collection: 'HairStyle',
    versionKey: false
})

const hairstyle = mongoose.model('HairStyle', HairStyleSchema)
export default hairstyle
