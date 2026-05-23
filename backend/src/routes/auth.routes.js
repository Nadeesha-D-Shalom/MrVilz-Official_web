const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { authRequired } = require("../middleware/auth");

const router = Router();

router.post("/login", authController.login);
router.get("/me", authRequired, authController.me);

module.exports = router;
