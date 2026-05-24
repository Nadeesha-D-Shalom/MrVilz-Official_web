const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { authRequired, loadAdminRole } = require("../middleware/auth");

const router = Router();

router.post("/login", authController.login);
router.get("/me", authRequired, loadAdminRole, authController.me);

module.exports = router;
