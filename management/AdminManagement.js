import * as util from '../utils/UtilFunctions.js'
import Admin from "../models/admin.js";
import bcrypt from 'bcryptjs'
import {ROLE} from "../configs/Global.js";

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

export function VerifyAdmin (AdminId, Role, UserName, callback) {
    try {
        if (!util.VariableTypeChecker(AdminId, 'string')
        && !util.VariableTypeChecker(AdminId, 'number')) {
            return (1, 'invalid_admin_id', 400, 'admin id is incorrect', null);
        }

        if (!util.VariableTypeChecker(UserName, 'string')) {
            return (1, 'invalid_username', 400, 'username is incorrect', null);
        }

        let where = {_id: AdminId, UserName: UserName, Role: Role}
        let attributes = ['_id', 'UserName', 'Role']

        Admin.findOne({
            where: where,
            attributes: attributes
        }).then(result => {
            "use strict"
            if (result) {
                return callback(null, null, 200, null, result)
            } else {
                return callback(1, 'invalid_admin', 405, null, null)
            }
        }).catch(function (error) {
            "use strict"
            return callback(1, 'find_admin_fail', 400, error, null)
        })
    } catch (error) {
        return callback(1, 'find_admin_fail', 400, error, null)
    }
}

export function CreateAdmin (accessAdminId, accessAdminRole, accessUserName, adminData, callback) {
    try {
        if (accessAdminRole !== ROLE.SUPER_ADMIN) {
            return callback(8, 'invalid_role', 403, 'this action is only performed by super admin', null);
        }

        if (!util.VariableTypeChecker(adminData.UserName, 'string')) {
            return callback(8, 'invalid_username', 400, 'username must be a string', null)
        }

        if (!util.VariableTypeChecker(adminData.Password, 'string')) {
            return callback(8, 'invalid_password', 400, 'password must be a string', null)
        }

        if (!util.VariableTypeChecker(adminData.DisplayName, 'string')) {
            return callback(8, 'invalid_display_name', 400, 'display name must be a string', null)
        }

        let query = {UserName: adminData.UserName}

        Admin.findOne(query, function (error, admin) {
            if (error) {
                return callback(8, 'create_admin_fail', 420, error)
            } else {
                if (admin) {
                    return callback(7, 'username_used', 420, 'please use another username')
                } else {
                    let oNewAdmin = new Admin();

                    let hashOfPass = bcrypt.hashSync(adminData.Password, 10);
                    oNewAdmin.UserName = adminData.UserName;
                    oNewAdmin.Password = hashOfPass;
                    oNewAdmin.DisplayName = adminData.DisplayName

                    oNewAdmin.CreatedBy = accessAdminId;
                    oNewAdmin.UpdatedBy = accessAdminId;

                    oNewAdmin.save(function (error) {
                        if (error) {
                            return callback(8, 'save_fail', 420, error, null)
                        }
                        return callback(null, null, 200, null, oNewAdmin)
                    });

                }
            }

        })
    } catch (error) {
        return callback(8, 'create_new_admin_fail', 400, error, null)
    }
}

export function GetAllAdmin (accessAdminId, accessAdminRole, accessAdminUserName, callback) {
    try {
        if (accessAdminRole !== ROLE.SUPER_ADMIN) {
            return callback(8, 'invalid_role', 403, 'this action is only performed by super admin', null);
        }

        Admin.find().select(['-Password']).exec((error, result) => {
            if (error) {
                return callback(1, 'get_admins_fail', 400, error, null)
            }
            return callback(null, null, 200, null, result)
        })
    } catch (error) {
        return callback(1, 'get_admins_fail', 400, error, null)
    }
}

export function DeleteAdmin (accessAdminId, accessAdminRole, accessAdminUserName, DeletingAdminId, callback) {
    try {
        if (accessAdminRole !== ROLE.SUPER_ADMIN) {
            return callback(8, 'invalid_role', 403, 'this action is only performed by super admin', null);
        }

        let query = {_id: DeletingAdminId}
        Admin.findOne(query, function (error, admin) {
            if (error) {
                return callback(8, 'find_admin_fail', 420, error)
            } else {
                if (admin) {
                    Admin.deleteOne(query, function (error) {
                        if (error) {
                            return callback(8, 'remove_fail', 420, error)
                        }
                        return callback(null, null, 200, null, admin._id)
                    })
                }
            }
        })
    } catch (error) {
        return callback(1, 'get_admins_fail', 400, error, null)
    }
}

export function UpdateAdmin (accessAdminId, accessAdminRole, accessAdminUserName, UpdatingAdminID, UpdateData, callback) {
    try {
        if (accessAdminRole !== ROLE.SUPER_ADMIN && accessAdminRole !== ROLE.ADMIN) {
            return callback(8, 'invalid_role', 403, 'you have no right to perform this action', null);
        }

        let update = {};
        let option = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {Password: false, Role: false}
        }
        let query = {_id: UpdatingAdminID}

        if (util.VariableTypeChecker(UpdateData.DisplayName, 'string')) {
            update.DisplayName = UpdateData.DisplayName
        }

        update.UpdatedBy = accessAdminId;
        update.UpdatedAt = Date.now();

        Admin.findOne(query, function (error, admin) {
            if (error) {
               return callback(8, 'update_admin_fail', 420, error)
            }
            else {
                if (admin) {
                    if (accessAdminUserName !== admin.UserName && accessAdminRole !== ROLE.SUPER_ADMIN) {
                        return callback(8, 'privacy_error', 403, 'you cannot modify information of other admins', null);
                    }

                    Admin.findOneAndUpdate(query, update, option,function (error, updatedAdmin) {
                        if (error) {
                            return callback(8, 'update_admin_fail', 420, error)
                        }

                        if (updatedAdmin) {
                            return callback(null, null, 200, null, updatedAdmin._id)
                        } else {
                            return callback(8, 'unavailable', 400, null, null)
                        }
                    })
                }
            }
        })
    } catch (error) {
        return callback(1, 'update_admin_fail', 400, error, null)
    }
}

export function UpdateAdminPassword (accessAdminId, accessAdminRole, accessAdminUserName, UpdatingAdminID, oldPassword, newPassword, callback) {
    try {
        if (accessAdminRole !== ROLE.SUPER_ADMIN && accessAdminRole !== ROLE.ADMIN) {
            return callback(8, 'invalid_role', 403, 'you have no right to perform this action', null);
        }

        let update = {};
        let option = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {Password: false, Role: false}
        }
        let query = {_id: UpdatingAdminID}

        update.UpdatedBy = accessAdminId;
        update.UpdatedAt = Date.now();

        Admin.findOne(query, function (error, admin) {
            if (error) {
                return callback(8, 'update_admin_fail', 420, error)
            }
            else {
                if (admin) {
                    if (accessAdminUserName !== admin.UserName && accessAdminRole !== ROLE.SUPER_ADMIN) {
                        return callback(8, 'privacy_error', 403, 'you cannot modify information of other admins', null);
                    }

                    if (accessAdminRole !== ROLE.SUPER_ADMIN) {
                        bcrypt.compare(oldPassword, admin.Password, function (error, result) {
                            if (result !== true) {
                                return callback(8, 'not_matched_passwords', 422, 'your old passwords do not match', null)
                            } else {
                                update.Password =  bcrypt.hashSync(newPassword, 10);
                                Admin.findOneAndUpdate(query, update, option,function (error, updatedAdmin) {
                                    if (error) {
                                        return callback(8, 'update_admin_password_fail', 420, error)
                                    }
                                    if (updatedAdmin) {
                                        return callback(null, null, 200, null, updatedAdmin._id)
                                    } else {
                                        return callback(8, 'unavailable', 400, null, null)
                                    }
                                })
                            }
                        })
                    } else {
                        update.Password =  bcrypt.hashSync(newPassword, 10);
                        Admin.findOneAndUpdate(query, update, option,function (error, updatedAdmin) {
                            if (error) {
                                return callback(8, 'update_admin_password_fail', 420, error)
                            }
                            if (updatedAdmin) {
                                return callback(null, null, 200, null, updatedAdmin._id)
                            } else {
                                return callback(8, 'unavailable', 400, null, null)
                            }
                        })
                    }
                }
            }
        })
    } catch (error) {
        return callback(1, 'update_admin_fail', 400, error, null)
    }
}