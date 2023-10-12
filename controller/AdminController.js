import * as AdminManagement from '../management/AdminManagement.js'
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import JsonWebTokenError from "jsonwebtoken";
import * as Rest from '../utils/Rest.js'
import MongoConfig from "../configs/MongoConfig.js";
export function Login (req, res) {
    let UserName = req.body.UserName || ''
    let Password = req.body.Password || ''

    AdminManagement.Authenticate(UserName, Password, function (ErrorCode, ErrorMess, httpCode, ErrorDescription, admin) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescription)
        }

        JsonWebTokenError.sign({id: admin._id, UserName: admin.UserName}, MongoConfig.authenticationkey, {expiresIn: '10 days'}, function (error, token) {
            if (error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error)
            } else {
                const success = {success: true}
                return Rest.SendSuccessToken(res, token, admin, success)
            }
        })
    })
}