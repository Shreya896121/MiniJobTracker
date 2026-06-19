"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
exports.resolvers = {
    Query: {
        applications: async (_, args) => {
            try {
                const { status, search } = args;
                const page = args.page || 1;
                const limit = args.limit || 5;
                const skip = (page - 1) * limit;
                const where = {};
                if (status) {
                    where.status = status;
                }
                if (search) {
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
                return {
                    applications: applications.map((app) => ({
                        ...app,
                        appliedDate: app.appliedDate.toISOString(),
                        createdAt: app.createdAt.toISOString(),
                        updatedAt: app.updatedAt.toISOString(),
                    })),
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages,
                    },
                };
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message || "Failed to fetch applications");
            }
        },
        application: async (_, args) => {
            try {
                const app = await prisma_1.default.application.findUnique({
                    where: { id: args.id },
                });
                if (!app) {
                    throw new graphql_1.GraphQLError(`Application with ID ${args.id} not found`, {
                        extensions: { code: "NOT_FOUND" },
                    });
                }
                return {
                    ...app,
                    appliedDate: app.appliedDate.toISOString(),
                    createdAt: app.createdAt.toISOString(),
                    updatedAt: app.updatedAt.toISOString(),
                };
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message || "Failed to fetch application");
            }
        },
    },
    Mutation: {
        createApplication: async (_, args) => {
            try {
                if (args.companyName.trim().length < 2) {
                    throw new graphql_1.GraphQLError("Company Name must be at least 2 characters", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                const app = await prisma_1.default.application.create({
                    data: {
                        companyName: args.companyName,
                        jobTitle: args.jobTitle,
                        jobType: args.jobType,
                        status: args.status || client_1.ApplicationStatus.APPLIED,
                        appliedDate: new Date(args.appliedDate),
                        notes: args.notes,
                    },
                });
                return {
                    ...app,
                    appliedDate: app.appliedDate.toISOString(),
                    createdAt: app.createdAt.toISOString(),
                    updatedAt: app.updatedAt.toISOString(),
                };
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message || "Failed to create application");
            }
        },
        updateApplication: async (_, args) => {
            try {
                const existing = await prisma_1.default.application.findUnique({
                    where: { id: args.id },
                });
                if (!existing) {
                    throw new graphql_1.GraphQLError(`Application with ID ${args.id} not found`, {
                        extensions: { code: "NOT_FOUND" },
                    });
                }
                if (args.companyName && args.companyName.trim().length < 2) {
                    throw new graphql_1.GraphQLError("Company Name must be at least 2 characters", {
                        extensions: { code: "BAD_USER_INPUT" },
                    });
                }
                const updateData = {};
                if (args.companyName !== undefined)
                    updateData.companyName = args.companyName;
                if (args.jobTitle !== undefined)
                    updateData.jobTitle = args.jobTitle;
                if (args.jobType !== undefined)
                    updateData.jobType = args.jobType;
                if (args.status !== undefined)
                    updateData.status = args.status;
                if (args.appliedDate !== undefined)
                    updateData.appliedDate = new Date(args.appliedDate);
                if (args.notes !== undefined)
                    updateData.notes = args.notes;
                const app = await prisma_1.default.application.update({
                    where: { id: args.id },
                    data: updateData,
                });
                return {
                    ...app,
                    appliedDate: app.appliedDate.toISOString(),
                    createdAt: app.createdAt.toISOString(),
                    updatedAt: app.updatedAt.toISOString(),
                };
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message || "Failed to update application");
            }
        },
        deleteApplication: async (_, args) => {
            try {
                const existing = await prisma_1.default.application.findUnique({
                    where: { id: args.id },
                });
                if (!existing) {
                    throw new graphql_1.GraphQLError(`Application with ID ${args.id} not found`, {
                        extensions: { code: "NOT_FOUND" },
                    });
                }
                await prisma_1.default.application.delete({
                    where: { id: args.id },
                });
                return true;
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message || "Failed to delete application");
            }
        },
    },
};
