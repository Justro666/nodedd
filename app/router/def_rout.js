const router = require("express").Router();
const controller = require("../access/controller/def_controller");

router.get("/", controller.all);
router.post("/", controller.add);

router
  .route("/:id")
  .get(controller.get)
  .patch(controller.patch)
  .delete(controller.drop);

// router.post("/:id/:phone", [
//   validator.validateParams(Schema.idPhParam, ["id", "phone"]),
//   controller.param
// ]);
module.exports = router;
