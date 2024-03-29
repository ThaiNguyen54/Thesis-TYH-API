import hairstyle from "../models/HairStyle.js";
import * as HairstyleManagement from '../management/HairstyleManagement.js'
import * as Rest from '../utils/Rest.js'
import * as util from '../utils/UtilFunctions.js'
import {v2 as cloudinary} from 'cloudinary'
import 'dotenv/config'
import fs from "fs"
import {resolve} from 'path'
import {spawn} from 'child_process'
import {initializeApp, cert} from 'firebase-admin/app'
import * as admin from 'firebase-admin'
import serviceAccount from '../admin_token/tryyourhair-835d2-firebase-adminsdk-jgbxc-4c3db75647.json' assert {type: 'json'}
import {getMessaging} from "firebase-admin/messaging";
import {response} from "express";
import HairStyle from "../models/HairStyle.js";
import Constant from "../utils/Constant.js";


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
const conda_env = 'shair'
// const conda_env = 'thesis-env'
const hairPath = '../Hair-AI-Engine/StyleYourHair/ffhq_image'
const generatedHairPath = resolve('../Hair-AI-Engine/StyleYourHair/style_your_hair_output')
const unprocessed_dir = resolve('../Hair-AI-Engine/StyleYourHair/unprocessed')
const process_face_script_dir = resolve('../Hair-AI-Engine/StyleYourHair/process_image_script.py')
const generate_hair_script_dir = resolve('../Hair-AI-Engine/StyleYourHair/generate_hair_script.py')
const hair_ai_engine_dir = resolve('../Hair-AI-Engine/StyleYourHair')


export async function GenerateHair (req, res){
    let no_extension_HairstyleName = req.body.HairstyleName
    let no_extension_ImageName = req.body.ImageName
    let HairstyleName = req.body.HairstyleName + '.png'
    let ImageName = req.body.ImageName + '.png'
    let ImageBase64 = req.body.ImageBase64
    let RegistrationToken = req.body.RegistrationToken.toString()
    let buffer = new Buffer(ImageBase64, 'base64')

    // Save user image to unprocessed folder
    ImageName = ImageName.replace(/\s/g, '_')
    ImageName = ImageName.replace(/:/g, '-')
    let saved_image_dir = unprocessed_dir + '/' + ImageName

    try {
        // Save user image to unprocessed folder
        fs.writeFileSync(saved_image_dir, buffer, (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('saved')
            }
        })

        // Pre-process the input face
        const pythonProcessFace = spawn(
            'conda',
            ['run', '-n', conda_env, 'python', process_face_script_dir],
            {cwd: hair_ai_engine_dir})

        pythonProcessFace.stdout.on('data', (data) => {
            const outputData = data.toString().trim()
            console.log(outputData)
        })

        pythonProcessFace.stderr.on('data', (data) => {
            console.log(`Python script error: ${data}`)
        })

        pythonProcessFace.on('close', (code) => {
            console.log(`Python script exited with code ${code}`)
            const args = [ImageName, HairstyleName]

            const generateHairProcess = spawn(
                'conda',
                ['run', '-n', conda_env, 'python', generate_hair_script_dir, '--image_name', ImageName, '--hairstyle_name', HairstyleName],
                {cwd: hair_ai_engine_dir}
            )

            generateHairProcess.stdout.on('data', (data) => {
                const outputData = data.toString().trim()
                console.log(outputData)
            })

            generateHairProcess.stderr.on('data', (data) => {
                console.log(`Python script error: ${data}`)
            })

            generateHairProcess.on('close', (code) => {
                cloudinary.uploader.upload(generatedHairPath + '/' + no_extension_ImageName + "_" + no_extension_HairstyleName + '.png',
                    {folder: 'Generated Hair'},
                    function (error, result) {
                        if(error) {
                            console.log(error)
                        } else {
                            console.log(result.url)

                            const message = {
                                data: {
                                    GeneratedImageURL: result.secure_url
                                },
                                token: RegistrationToken
                            }

                            getMessaging().send(message)
                                .then((response) => {
                                    console.log('Successfully sent message:', response)
                                })
                                .catch((error) => {
                                    console.log('Error sending message:', error)
                                })

                            res.send({
                                GeneratedImageURL: result.url
                            })
                        }
                    })
            })
        })
    } catch (e) {
        res.send({
            message: e
        })
    }
}

async function handleUpload(file, file_name){
    return await cloudinary.uploader.upload(file, {
            folder: 'StyleYourHair',
            resource_type: "auto",
            public_id: file_name
        },
        async function (error, result) {
            console.log(result.url)
        })
}

async function UploadImage(req, res) {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64
        let file_name = util.removeExtension(req.file.originalname)
        const cldRes = await handleUpload(dataURI, file_name)
        res.json(cldRes)
        console.log(res.json(cldRes))
    } catch (error) {
        res.send({
            message: error.message
        })
    }
}

export async function AddHairStyle(req, res) {
    try {
        if (Constant.ALLOWED_IMAGE_TYPE.includes(req.file.mimetype)) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let buffer = new Buffer(b64, 'base64')
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            let file_name = util.removeExtension(req.body.Name)
            file_name = file_name.trim()
            fs.writeFileSync(unprocessed_dir + '/' + file_name + '.png', buffer, (error) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('saved')
                }
            })
            const pythonProcessFace = spawn(
                'conda',
                ['run', '-n', conda_env, 'python', process_face_script_dir],
                {cwd: hair_ai_engine_dir})

            pythonProcessFace.stdout.on('data', (data) => {
                const outputData = data.toString().trim()
                console.log(outputData)
            })

            pythonProcessFace.stderr.on('data', (data) => {
                console.log(`Python script error: ${data}`)
            })

            pythonProcessFace.on('close', async (code) => {
                console.log(`Python script exited with code ${code}`)
                await cloudinary.uploader.upload(hairPath + '/' + file_name + '.png',
                    {folder: 'StyleYourHair', resource_type: 'auto', public_id: file_name},
                    async function (error, result) {
                        if (error) {
                            console.log(error)
                        } else {
                            // await util.DownloadImage(result.url, hairPath + '/' + file_name + '.png')
                            req.body.Url = result.secure_url
                            req.body.CreatedBy = req.query.AdminId
                            req.body.UpdatedBy = req.query.AdminId
                            const NewHairStyle = new hairstyle(req.body);
                            const HairStyleInsertData = await hairstyle.insertMany(NewHairStyle);
                            if (!HairStyleInsertData) {
                                throw new Error('Can not insert new hairstyle');
                            } else {
                                return res.json({
                                    success: true,
                                    message: "inserted new hairstyle",
                                    hairstyle: HairStyleInsertData
                                })
                            }
                        }
                    }
                )
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'invalid image type, accept .jpg, .jpeg, .png',
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(404).send(error)
    }
}

export function GetAllHairStyle(req, res) {
    hairstyle.find()
        .then(allHairStyle => {
            return res.status(200).json({
                success: true,
                message: 'List of all hairstyle',
                Hairstyles: allHairStyle
            });
        })
        .catch((error) => {
            return (
                res.status(500).json({
                    success: false,
                    code: 8,
                    message: 'Can not get hairstyles. Please try again.',
                    description: error.message
                })
            )
        })
}

export function GetHairStyleBasedOnCategory(req, res) {
    let category = req.params.Category
    hairstyle.find({
        Category: category
    })
        .then(allHairStyle => {
            return res.status(200).json({
                success: true,
                message: 'List of all hairstyle',
                Hairstyles: allHairStyle
            });
        })
        .catch((error) => {
            return (
                res.status(500).json({
                    success: false,
                    code: 8,
                    message: 'Can not get hairstyles. Please try again.',
                    description: error.message
                })
            )
        })
}

export function DeleteHairstyle (req, res) {
    let HairstyleID = req.params.HairstyleID || '';
    HairstyleManagement.Delete(HairstyleID, function (errorCode, errorMessage, httpCode, errorDescription) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
        }
        let ResultData = {};
        ResultData.id = HairstyleID;
        return Rest.SendSuccess(res, ResultData, httpCode, 'Deleted a hairstyle');
    })
}

export async function SetTrending(req, res) {
    try {
        console.log('ok')
        let id = req.params.HairstyleID || ''
        let Trending = req.body.Trending || 0
        let updateData = {Trending: Trending}
        const options = {new: true}
        const result = await HairStyle.findByIdAndUpdate(
            id, updateData, options
        )
        return res.status(200).json({
            success: true,
            message: 'update hairstyle successfully',
            Hairstyle: result
        });
    } catch (error) {
        return (
            res.status(500).json({
                success: false,
                code: 8,
                message: 'Can not update hairstyles. Please try again.',
                description: error.message
            })
        )
    }
}

export async function UpdateHairstyle(req, res) {
    try {
        let id = req.params.HairstyleID || '';
        let data = req.body || '';
        let old_name = req.body.old_name
        const isUpdateImage = req.body.isUpdateImage || 'false'
        const updateData = JSON.parse(req.body.update)
        if (updateData.Name !== undefined) {
            fs.renameSync(hairPath + '/' + old_name + '.png', hairPath + '/' + updateData.Name + '.png')
        }

        if (isUpdateImage === 'true') {
            try {
                const b64 = Buffer.from(req.file.buffer).toString('base64')
                let buffer = new Buffer(b64, 'base64')
                let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64
                // let file_name = util.removeExtension(req.file.originalname)
                let file_name = old_name
                file_name = file_name.trim()
                let name_for_saving = file_name
                name_for_saving = name_for_saving.trim()
                if (updateData.Name !== undefined) {
                    name_for_saving = updateData.Name
                }
                fs.writeFileSync(unprocessed_dir + '/' + name_for_saving + '.png', buffer, (error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log('saved')
                    }
                })

                const pythonProcessFace = spawn(
                    'conda',
                    ['run', '-n', conda_env, 'python', process_face_script_dir],
                    {cwd: hair_ai_engine_dir})

                pythonProcessFace.stderr.on('data', (data) => {
                    console.log(`Python script error: ${data}`)
                })

                pythonProcessFace.on('close', async (code) => {
                    console.log(`Python script exited with code ${code}`)
                    await cloudinary.uploader.upload(hairPath + '/' + name_for_saving + '.png',
                        {folder: 'StyleYourHair', resource_type: 'auto', public_id: name_for_saving},
                        async function (error, result) {
                            if (error) {
                                console.log(error)
                            } else {
                                updateData.Url = result.secure_url
                                let image_path = hairPath + '/' + file_name + '.png'
                                console.log(image_path)
                                if (fs.existsSync(image_path)) {
                                    await fs.unlink(image_path, (err) => {
                                        if (err) {
                                            console.log(err)
                                            return res.send({
                                                message: err.message
                                            })
                                        }
                                    })
                                    console.log('File deleted successfully')
                                } else {
                                    console.log('File not found')
                                }

                                await util.DownloadImage(result.secure_url, image_path)
                                let AdminId = req.body.AdminId

                                HairstyleManagement.Update(id, AdminId, updateData, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                                    if (errorCode) {
                                        return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
                                    }
                                    let outResultData = {};
                                    outResultData.id = result._id;
                                    return Rest.SendSuccess(res, outResultData, httpCode, 'Updated a hairstyle');
                                })
                            }
                        }
                    )
                })
            } catch (error) {
                return res.send({
                    message: error.message
                })
            }
        }

        if (isUpdateImage === 'false') {
            let AdminId = req.body.AdminId

            HairstyleManagement.Update(id, AdminId, updateData, function (errorCode, errorMessage, httpCode, errorDescription, result) {
                if (errorCode) {
                    return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription);
                }
                let outResultData = {};
                outResultData.id = result._id;
                return Rest.SendSuccess(res, outResultData, httpCode, 'Updated a hairstyle');
            })
        }
    } catch (error) {
        console.log(error)
        return Rest.SendError(res, 8, 'update_hairstyle_fail', 500, error.message, error);
    }
}


