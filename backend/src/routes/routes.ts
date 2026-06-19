import { Router } from "express";
import { testDbConnection } from "../controllers/test.controller";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller";

const router = Router();

// Test endpoint to verify database connection
router.get("/test-db", testDbConnection);

// Application CRUD endpoints
router.post("/applications", createApplication);
router.get("/applications", getApplications);
router.get("/applications/:id", getApplicationById);
router.patch("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);

export default router;
