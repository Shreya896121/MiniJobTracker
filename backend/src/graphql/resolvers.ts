import prisma from "../prisma";
import { ApplicationStatus, JobType, Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    applications: async (
      _: any,
      args: {
        status?: ApplicationStatus;
        search?: string;
        page?: number;
        limit?: number;
      }
    ) => {
      try {
        const { status, search } = args;
        const page = args.page || 1;
        const limit = args.limit || 5;
        const skip = (page - 1) * limit;

        const where: Prisma.ApplicationWhereInput = {};

        if (status) {
          where.status = status;
        }

        if (search) {
          where.OR = [
            { companyName: { contains: search, mode: "insensitive" } },
            { jobTitle: { contains: search, mode: "insensitive" } },
          ];
        }

        const total = await prisma.application.count({ where });

        const applications = await prisma.application.findMany({
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
      } catch (error: any) {
        throw new GraphQLError(error.message || "Failed to fetch applications");
      }
    },

    application: async (_: any, args: { id: string }) => {
      try {
        const app = await prisma.application.findUnique({
          where: { id: args.id },
        });

        if (!app) {
          throw new GraphQLError(`Application with ID ${args.id} not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return {
          ...app,
          appliedDate: app.appliedDate.toISOString(),
          createdAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
        };
      } catch (error: any) {
        throw new GraphQLError(error.message || "Failed to fetch application");
      }
    },
  },

  Mutation: {
    createApplication: async (
      _: any,
      args: {
        companyName: string;
        jobTitle: string;
        jobType: JobType;
        status?: ApplicationStatus;
        appliedDate: string;
        notes?: string;
      }
    ) => {
      try {
        if (args.companyName.trim().length < 2) {
          throw new GraphQLError("Company Name must be at least 2 characters", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const app = await prisma.application.create({
          data: {
            companyName: args.companyName,
            jobTitle: args.jobTitle,
            jobType: args.jobType,
            status: args.status || ApplicationStatus.APPLIED,
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
      } catch (error: any) {
        throw new GraphQLError(error.message || "Failed to create application");
      }
    },

    updateApplication: async (
      _: any,
      args: {
        id: string;
        companyName?: string;
        jobTitle?: string;
        jobType?: JobType;
        status?: ApplicationStatus;
        appliedDate?: string;
        notes?: string;
      }
    ) => {
      try {
        const existing = await prisma.application.findUnique({
          where: { id: args.id },
        });

        if (!existing) {
          throw new GraphQLError(`Application with ID ${args.id} not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        if (args.companyName && args.companyName.trim().length < 2) {
          throw new GraphQLError("Company Name must be at least 2 characters", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const updateData: any = {};
        if (args.companyName !== undefined) updateData.companyName = args.companyName;
        if (args.jobTitle !== undefined) updateData.jobTitle = args.jobTitle;
        if (args.jobType !== undefined) updateData.jobType = args.jobType;
        if (args.status !== undefined) updateData.status = args.status;
        if (args.appliedDate !== undefined) updateData.appliedDate = new Date(args.appliedDate);
        if (args.notes !== undefined) updateData.notes = args.notes;

        const app = await prisma.application.update({
          where: { id: args.id },
          data: updateData,
        });

        return {
          ...app,
          appliedDate: app.appliedDate.toISOString(),
          createdAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
        };
      } catch (error: any) {
        throw new GraphQLError(error.message || "Failed to update application");
      }
    },

    deleteApplication: async (_: any, args: { id: string }) => {
      try {
        const existing = await prisma.application.findUnique({
          where: { id: args.id },
        });

        if (!existing) {
          throw new GraphQLError(`Application with ID ${args.id} not found`, {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await prisma.application.delete({
          where: { id: args.id },
        });

        return true;
      } catch (error: any) {
        throw new GraphQLError(error.message || "Failed to delete application");
      }
    },
  },
};
