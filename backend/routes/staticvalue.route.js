import express from "express";
import { getValue } from "../controllers/staticvalue.controller.js";

const router = express.Router();

router.get("/getstaticvalue/:key", getValue);

export default router;
