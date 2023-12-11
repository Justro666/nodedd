const router = require("express").Router();
const controller = require("../access/controller/admin_controller");

router.get("/", controller.all);
router.post("/register", controller.register);
router.post("/login", controller.login);

router
  .route("/:id")
  .get(controller.get)
  .patch(controller.patch)
  .delete(controller.drop);

module.exports = router;
