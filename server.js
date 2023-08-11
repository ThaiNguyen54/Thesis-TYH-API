import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import https from 'https'
import MongoConfig from './configs/MongoConfig.js'
import hairstyleroute from './route/HairStyleRoute.js'
import fs from "fs";

const app = express()

app.use(bodyParser.json({
    limit: "30mb"
}))

app.use(bodyParser.urlencoded({
    extended: true,
    limit: "30mb"
}))

app.use('/', cors())
app.use(cors())
app.use(hairstyleroute)

// Connect to mongodb
mongoose.connect(MongoConfig.mongodb.THAI_uri);

let port = process.env.PORT;
if (port == null || port === "") {
    port = 7001;
}

// https.createServer({
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// },app)
//     .listen(port, () => {
//         console.log(`Server is running on port ${port}`)
//     })


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


