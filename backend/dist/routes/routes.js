"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();
// Test endpoint to verify database connection
router.get("/test-db", test_controller_1.testDbConnection);
// Application CRUD endpoints
router.post("/applications", application_controller_1.createApplication);
router.get("/applications", application_controller_1.getApplications);
router.get("/applications/:id", application_controller_1.getApplicationById);
router.patch("/applications/:id", application_controller_1.updateApplication);
router.delete("/applications/:id", application_controller_1.deleteApplication);
exports.default = router;
