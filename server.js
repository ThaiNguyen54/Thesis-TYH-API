import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import MongoConfig from './configs/MongoConfig.js'
import hairstyleroute from './route/HairStyleRoute.js'

const app = express()

app.use(bodyParser.json({
    limit: "30mb"
}))

app.use(bodyParser.urlencoded({
    extended: true,
    limit: "30mb"
}))

app.use('/', cors())
app.use(hairstyleroute)

// Connect to mongodb
mongoose.connect(MongoConfig.mongodb.THAI_uri);

let port = process.env.PORT;
if (port == null || port === "") {
    port = 7001;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


