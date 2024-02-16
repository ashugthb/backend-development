import express from "express";
import {
  getAllController,
  getOneController,
  addController,
  updateController,
  deleteController,
} from "../controllers/productController.js";

//router object
const router = express.Router();

router.get("/", getAllController);
router.get("/:id", getOneController);
router.post("/", addController);
router.patch("/:id", updateController);
router.delete("/:id", deleteController);

export default router;
