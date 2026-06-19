"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();

router.get("/test-db", application_controller_1.testDbConnection);
router.post("/applications", application_controller_1.createApplication);
router.get("/applications", application_controller_1.getApplications);
router.get("/applications/:id", application_controller_1.getApplicationById);
router.patch("/applications/:id", application_controller_1.updateApplication);
router.delete("/applications/:id", application_controller_1.deleteApplication);
exports.default = router;
