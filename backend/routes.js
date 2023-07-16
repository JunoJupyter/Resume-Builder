import express from "express";
import cors from "cors";
import { dataUpload } from "./fileController.js";

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

router.route("/resume")
  .post(dataUpload);

export default router;
