const express = require("express");
const router = express.Router();
const likeCtrl = require("../controllers/like");
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Creat
router.post("/", auth, multer, sauceCtrl.creatSauce);

// Get
router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);

// Modify
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Delete
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Like
router.post("/:id/like", auth, likeCtrl.likeSauce);

module.exports = router;
