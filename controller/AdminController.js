import * as AdminManagement from '../management/AdminManagement.js'
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import JsonWebTokenError from "jsonwebtoken";
import * as Rest from '../utils/Rest.js'
import MongoConfig from "../configs/MongoConfig.js";
import * as GlobalConfig from "../configs/Global.js"

export function Login (req, res) {
    let UserName = req.body.UserName || ''
    let Password = req.body.Password || ''

    AdminManagement.Authenticate(UserName, Password, function (ErrorCode, ErrorMess, httpCode, ErrorDescription, admin) {
        if (ErrorCode) {
            return Rest.SendError(res, ErrorCode, ErrorMess, httpCode, ErrorDescription)
        }

        JsonWebTokenError.sign({id: admin._id, UserName: admin.UserName, DisplayName: admin.DisplayName, Role: admin.Role, AvatarUrl: admin.AvatarUrl}, GlobalConfig.JWTPublicKey.PublicKey, {expiresIn: '10 days'}, function (error, token) {
            if (error) {
                return Rest.SendError(res, 1, 'Creating Token Failed', 400, error)
            } else {
                const success = {success: true}
                return Rest.SendSuccessToken(res, token, admin, success)
            }
        })
    })
}

export function CreateAdmin (req, res) {
    let accessAdminId = req.query.AdminId || '';
    let accessAdminRole = req.query.Role || '';
    let accessAdminUserName = req.query.UserName || '';

    let data = req.body || '';

    console.log(data)
    AdminManagement.CreateAdmin(accessAdminId, accessAdminRole, accessAdminUserName, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription)
        }
        let oResData = {};
        oResData.id = result._id;
        return Rest.SendSuccess(res, oResData, httpCode);
    })
}

export function GetAllAdmin (req, res) {
    let accessAdminId = req.query.AdminId || '';
    let accessAdminRole = req.query.Role || '';
    let accessAdminUserName = req.query.UserName || '';

    AdminManagement.GetAllAdmin(accessAdminId, accessAdminRole, accessAdminUserName, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription)
        }
        return Rest.SendSuccess(res, result, httpCode);
    })

}

export function DeleteAdmin (req, res) {
    let accessAdminId = req.body.AdminId || '';
    let accessAdminRole = req.body.Role || '';
    let accessAdminUserName = req.body.UserName || '';
    let DeletingAdminId =  req.params.AdminId || '';

    AdminManagement.DeleteAdmin(accessAdminId, accessAdminRole, accessAdminUserName, DeletingAdminId, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription)
        }
        return Rest.SendSuccess(res, result, httpCode);
    })
}

export function UpdateAdmin (req, res) {
    let accessAdminId = req.body.AdminId || '';
    let accessAdminRole = req.body.Role || '';
    let accessAdminUserName = req.body.UserName || '';
    let UpdatingAdminId =  req.params.AdminId || '';
    let data = req.body || '';

    AdminManagement.UpdateAdmin(accessAdminId, accessAdminRole, accessAdminUserName, UpdatingAdminId, data, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription)
        }
        return Rest.SendSuccess(res, result, httpCode);
    })
}

export function UpdateAdminPassword (req, res) {
    console.log('ok')
    let accessAdminId = req.body.AdminId || '';
    let accessAdminRole = req.body.Role || '';
    let accessAdminUserName = req.body.UserName || '';
    let UpdatingAdminId =  req.params.AdminId || '';
    let oldPassword = req.body.oldPassword || '';
    let newPassword = req.body.newPassword || '';

    AdminManagement.UpdateAdminPassword(accessAdminId, accessAdminRole, accessAdminUserName, UpdatingAdminId, oldPassword, newPassword, function (errorCode, errorMessage, httpCode, errorDescription, result) {
        if (errorCode) {
            return Rest.SendError(res, errorCode, errorMessage, httpCode, errorDescription)
        }
        return Rest.SendSuccess(res, result, httpCode);
    })
}