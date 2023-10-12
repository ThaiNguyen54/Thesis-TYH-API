import express from "express";
import * as AdminController from '../controller/AdminController.js'
import Admin from "../models/admin.js";

const router = express.Router()

router.post('/shair-engine/ver1/admin/login', AdminController.Login)

export default router