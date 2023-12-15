import dotenv from 'dotenv'
dotenv.config()

let CloudinaryConfig = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
}

export default CloudinaryConfig