// Set Mongodb URL and Root URL
let APIROOT_URL = 'http://localhost:3001';
let THAI_MONGO_URL = 'mongodb+srv://thai:thai123@cluster0.l5pwkhm.mongodb.net/TryYourHair'

// Config Mongo Connection
let mongoConnection = {
    https: false,
    appname: 'Try Your Hair',
    port: process.env.PORT || 3000,
    url: APIROOT_URL,
    path: {
        public: '/public',
        tmp: '/tmp',
        docs: '/docs',
        tag: '/tag'
    },
    mongodb: {
        THAI_uri: THAI_MONGO_URL,
        username: ''
    }
}



export default mongoConnection;