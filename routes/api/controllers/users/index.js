const express = require("express");
const userController = require("./user.controller");
const { uploadImage } = require("./../../../../middlewares/uploadimages");
const { authenticate } = require("./../../../../middlewares/auth");
const { validatePostUser } = require("./../../../../middlewares/validation/users/postUser");
const router = express.Router();


router.post("/create", validatePostUser, userController.createUser);
router.post("/login", userController.login);
router.patch("/upload-avatar", authenticate, uploadImage(), userController.uploadAvatar);
router.delete("/:id", authenticate, userController.deleteUser);
router.get("", authenticate, userController.getUsers);
router.get("/:id", authenticate, userController.getUserById);
router.get("/:type", authenticate, userController.getUsersByType);
router.put("/:id", authenticate, userController.updateUser);

module.exports = router;
