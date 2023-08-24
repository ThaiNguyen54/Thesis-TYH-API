import * as util from '../utils/UtilFunctions.js'
import Validator from 'validator'
import HairStyle from "../models/hairstyle.js";

export function Delete (HairstyleID, callback) {
    try {
        if(!util.VariableTypeChecker(HairstyleID, 'string') || !Validator.isMongoId(HairstyleID)) {
            return callback(8, 'invalid_id', 400, 'Hairstyle ID is not a string')
        }

        let query = {_id: HairstyleID}
        HairStyle.findOne(query, function (error, hairstyle) {
            if (error) {
                return callback(8, 'The hairstyle is not exist', 420, error)
            }
            else {
                if (hairstyle) {
                    HairStyle.deleteOne({_id: HairstyleID}, function (error) {
                        if (error) {
                            return callback(8, 'Remove failed', 420, error)
                        }
                        return  callback(null, null, 200, null, hairstyle)
                    })
                }
            }
        })
    }
    catch (error) {
        return callback(8, 'Delete hairstyle failed', 400, error)
    }
}

export function Update (HairstyleID, UpdateData, callback) {
    try {
        let query = {_id: HairstyleID};
        HairStyle.findOne(query, function (error, hairstyle) {
            if (error) {
                return callback(8, 'The hairstyle is not exist', 420, error);
            }
            else {
                 let update = {};
                 let options = {
                     upsert: false,
                     new: true,
                     setDefaultsOnInsert: true
                 };
                 if (util.VariableTypeChecker(UpdateData.Name, 'string')) {
                     update.Name = UpdateData.Name;
                 }
                 if (util.VariableTypeChecker(UpdateData.Url, 'string')) {
                     update.Url = UpdateData.Url;
                 }
                 if (util.VariableTypeChecker(UpdateData.Des, 'string')) {
                     update.Des = UpdateData.Des;
                 }

                 HairStyle.findOneAndUpdate(query, update, options, function (error, updatedHairstyle) {
                     if (error) {
                         return callback(8, 'Update failed', 420, error, null)
                     }
                     if (updatedHairstyle) {
                         return callback(null, null, 200, null, updatedHairstyle)
                     }
                     else {
                         return callback(8, 'Hairstyle is not available', 400, null, null)
                     }
                 })
            }
        })
    } catch (error) {
        return callback(8, 'Update failed', 400, error, null)
    }
}