const router = require("express").Router();
const controller = require("../access/controller/auth_controller");
// const schema = require("../access/validator/vschema");
// const { validateToken } = require("../access/middleware/validator");

const listEndpoints = require("express-list-endpoints");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/refreshToken", controller.refreshToken);

// console.log(listEndpoints(router));

module.exports = router;
