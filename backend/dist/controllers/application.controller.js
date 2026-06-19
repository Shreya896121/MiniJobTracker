"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplicationById = exports.getApplications = exports.createApplication = exports.testDbConnection = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const application_validation_1 = require("../validation/application.validation");

const testDbConnection = async (req, res, next) => {
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({
            success: true,
            message: "Database connection verified successfully!",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.testDbConnection = testDbConnection;

const createApplication = async (req, res, next) => {
    try {
        const parseResult = application_validation_1.createApplicationSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parseResult.error.flatten().fieldErrors,
            });
            return;
        }
        const application = await prisma_1.default.application.create({
            data: parseResult.data,
        });
        res.status(201).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createApplication = createApplication;
const client_1 = require("@prisma/client");

const getApplications = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const where = {};
        if (status && typeof status === "string") {
            if (Object.values(client_1.ApplicationStatus).includes(status)) {
                where.status = status;
            }
            else {
                res.status(400).json({
                    success: false,
                    message: `Invalid status parameter. Must be one of: ${Object.values(client_1.ApplicationStatus).join(", ")}`,
                });
                return;
            }
        }
        if (search && typeof search === "string") {
            where.OR = [
                { companyName: { contains: search, mode: "insensitive" } },
                { jobTitle: { contains: search, mode: "insensitive" } },
            ];
        }

        const total = await prisma_1.default.application.count({ where });
        const applications = await prisma_1.default.application.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            success: true,
            data: applications,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getApplications = getApplications;

const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid ID parameter",
            });
            return;
        }
        const application = await prisma_1.default.application.findUnique({
            where: { id },
        });
        if (!application) {
            res.status(404).json({
                success: false,
                message: `Application with ID ${id} not found`,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getApplicationById = getApplicationById;

const updateApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid ID parameter",
            });
            return;
        }
        const parseResult = application_validation_1.updateApplicationSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parseResult.error.flatten().fieldErrors,
            });
            return;
        }

        const existing = await prisma_1.default.application.findUnique({
            where: { id },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: `Application with ID ${id} not found`,
            });
            return;
        }
        const updatedApplication = await prisma_1.default.application.update({
            where: { id },
            data: parseResult.data,
        });
        res.status(200).json({
            success: true,
            data: updatedApplication,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplication = updateApplication;

const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).json({
                success: false,
                message: "Invalid ID parameter",
            });
            return;
        }
        const existing = await prisma_1.default.application.findUnique({
            where: { id },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: `Application with ID ${id} not found`,
            });
            return;
        }
        await prisma_1.default.application.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: `Application with ID ${id} has been deleted`,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteApplication = deleteApplication;
