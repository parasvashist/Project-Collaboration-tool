import express from "express";
import { getLogs, getLogsByEntity } from "../controllers/activityLogcontroller.js";
import { auth } from "../middleware/authmiddleware.js";

const router = express.Router();

// All authenticated users can view logs
router.get("/", auth, getLogs);

// Get logs for a specific entity (project/task/team)
router.get("/:entityType/:entityId", auth, getLogsByEntity);

export default router;
