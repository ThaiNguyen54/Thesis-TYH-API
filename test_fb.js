import {v2 as cloudinary} from 'cloudinary'
import 'dotenv/config'
import {resolve} from 'path'
import {initializeApp, cert} from 'firebase-admin/app'
import * as admin from 'firebase-admin'
import serviceAccount from './admin_token/tryyourhair-835d2-firebase-adminsdk-jgbxc-4c3db75647.json' assert {type: 'json'}
import {getMessaging} from "firebase-admin/messaging";
import {response} from "express";


// Initialize firebase
initializeApp({
    credential: cert(serviceAccount)
})

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


// const conda_env = 'shair'
const conda_env = 'thesis-env'
const hairPath = '../Hair-AI-Engine/StyleYourHair/ffhq_image'
const generatedHairPath = resolve('../Hair-AI-Engine/StyleYourHair/style_your_hair_output')
const unprocessed_dir = resolve('../Hair-AI-Engine/StyleYourHair/unprocessed')
const gen_hair_batch_dir = '../Hair-AI-Engine/StyleYourHair/gen_hair.bat'
const process_face_script_dir = resolve('../Hair-AI-Engine/StyleYourHair/process_image_script.py')
const generate_hair_script_dir = resolve('../Hair-AI-Engine/StyleYourHair/generate_hair_script.py')
const hair_ai_engine_dir = resolve('../Hair-AI-Engine/StyleYourHair')


const RegistrationToken = 'cozDwAjoTBSNgIJsssAADH:APA91bGBcE6R3qLFmYp6dUJ_kZ_SQZnKhZNiAlWiDsZhT4pdgNGFEciaxrMDaXozoU2T5az7H5fcrHe9520RpgcW_tcXmEarXxzC9SWO6KI66BOGRf39cgy90HO2mFIBNZRE0_yjFYE7'


const payload = {
    data: {
        mess: "hello"
    },
    token: RegistrationToken
}


getMessaging().send(payload)
    .then((response) => {
        console.log('successfully sent message', response)
    })
    .catch((error) => {
        console.log('Error sending message:', error)
    })


// admin.messaging().sendToDevice(RegistrationToken, payload)
//     .then((response) => {
//         console.log('sent message successfully: ', response)
//     })
//     .catch((error) => {
//         console.log('Error sending message: ', error)
//     })