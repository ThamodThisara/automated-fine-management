import express from "express";
import {
  complainCreate,
  getAllComplains,
} from "../controllers/complain.controller.js";

const router = express.Router();

router.post("/complainadd", complainCreate);
router.get("/all", getAllComplains);

export default router;
