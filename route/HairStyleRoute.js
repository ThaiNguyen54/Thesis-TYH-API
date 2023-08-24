import express from "express";
import * as HairStyleControl from "../controller/hairstylecontroller.js";
import multer from "multer";

const storage = new multer.memoryStorage()
const upload = multer({
    storage
})
const router = express.Router()
router.post("/ver1/generate_hair", HairStyleControl.GenerateHair)
router.post("/ver1/hairstyle", upload.single('my_file', 'imgInfo'), HairStyleControl.AddHairStyle)
router.get("/ver1/hairstyle", HairStyleControl.GetAllHairStyle)
router.delete("/ver1/hairstyle/:HairstyleID", HairStyleControl.DeleteHairstyle)
router.put("/ver1/hairstyle/:HairstyleID", upload.single('my_file', 'isUpdateImage', 'edit_data'), HairStyleControl.UpdateHairstyle)

export default router;