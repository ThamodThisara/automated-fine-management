import express from "express";
import {
  checkout,
  updateSuccessPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout", checkout);
router.post("/update-fine", updateSuccessPayment);
export default router;
