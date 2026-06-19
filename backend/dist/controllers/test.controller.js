"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const testDbConnection = async (req, res) => {
    try {
        // Run a simple query to check the database connection
        await prisma_1.default.$queryRaw `SELECT 1`;
        res.status(200).json({
            success: true,
            message: "Database connection verified successfully!",
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            success: false,
            message: "Failed to connect to the database.",
            error: errorMessage,
        });
    }
};
exports.testDbConnection = testDbConnection;
