const express = require("express");
const userController = require("./user.controller");
const { uploadImage } = require("./../../../../middlewares/uploadimages");
const { authenticate } = require("./../../../../middlewares/auth");
const { validatePostUser } = require("./../../../../middlewares/validation/users/postUser");
const router = express.Router();


router.post("/", validatePostUser, userController.createUser);
router.post("/login", userController.login);
router.patch("/upload-avatar", authenticate, uploadImage(), userController.uploadAvatar);

module.exports = router;
