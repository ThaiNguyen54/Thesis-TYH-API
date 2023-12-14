import express from "express";
import * as HairStyleControl from "../controller/HairStyleController.js";
import multer from "multer";

const storage = new multer.memoryStorage()
const upload = multer({
    storage
})
const router = express.Router()
router.post("/shair-engine/ver1/generate_hair", HairStyleControl.GenerateHair)
router.post("/shair-engine/ver1/auth/hairstyle", upload.single('my_file', 'imgInfo'), HairStyleControl.AddHairStyle)
router.get("/shair-engine/ver1/hairstyle", HairStyleControl.GetAllHairStyle)
router.delete("/shair-engine/ver1/auth/hairstyle/:HairstyleID", HairStyleControl.DeleteHairstyle)
router.put("/shair-engine/ver1/auth/hairstyle/:HairstyleID", upload.single('my_file', 'isUpdateImage', 'edit_data'), HairStyleControl.UpdateHairstyle)
router.put("/shair-engine/ver1/auth/hairstyle/trending/:HairstyleID", HairStyleControl.SetTrending)
export default router;