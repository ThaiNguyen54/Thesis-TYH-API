import * as util from '../utils/UtilFunctions.js'
import Admin from "../models/admin.js";
import bcrypt from 'bcryptjs'
export function Authenticate (UserName, Password, callback){
    try {
        if(!util.VariableTypeChecker(UserName, 'string')) {
            return callback(8, 'invalid username', 422, 'your username is not a string', null)
        }

        if(!util.VariableTypeChecker(Password, 'string')) {
            return callback(8, 'invalid password', 422, 'your password is not a string', null)
        }

        Admin.findOne( {UserName: UserName}, function (error, admin) {
            if (error) {
                return callback(8, 'Not found', 420, error, null)
            }

            if (admin) {
                bcrypt.compare(Password, admin.Password, function (error, result) {
                    if (result === true) {
                        const success = {success: true}
                        return callback(null, null, 200, null, admin)
                    } else {
                        return callback(8, 'wrong password', 422, 'password or username is not match', null)
                    }

                })
            } else {
                return callback(8, 'unavailable', 404, 'cannot find your credential', null)
            }
        })

    }
    catch (error) {
        return callback(8, 'authenticate failed', 400, error, null)
    }
}