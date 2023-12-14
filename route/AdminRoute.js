import express from "express";
import * as AdminController from '../controller/AdminController.js'
import Admin from "../models/admin.js";

const router = express.Router()

router.post('/shair-engine/ver1/admin/login', AdminController.Login)
router.post('/shair-engine/ver1/auth/admin', AdminController.CreateAdmin)
router.get('/shair-engine/ver1/auth/admin', AdminController.GetAllAdmin)
router.delete('/shair-engine/ver1/auth/admin/:AdminId', AdminController.DeleteAdmin)
router.put('/shair-engine/ver1/auth/admin/:AdminId', AdminController.UpdateAdmin)
router.put('/shair-engine/ver1/auth/admin/pass/:AdminId', AdminController.UpdateAdminPassword)

export default router