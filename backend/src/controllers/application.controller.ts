import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { createApplicationSchema, updateApplicationSchema } from "../validation/application.validation";

export const testDbConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Database connection verified successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = createApplicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const application = await prisma.application.create({
      data: parseResult.data,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
import { Prisma, ApplicationStatus } from "@prisma/client";

export const getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {};

    if (status && typeof status === "string") {
      if (Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
        where.status = status as ApplicationStatus;
      } else {
        res.status(400).json({
          success: false,
          message: `Invalid status parameter. Must be one of: ${Object.values(ApplicationStatus).join(", ")}`,
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
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid ID parameter",
      });
      return;
    }

    const application = await prisma.application.findUnique({
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
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid ID parameter",
      });
      return;
    }

    const parseResult = updateApplicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
      return;
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: parseResult.data,
    });

    res.status(200).json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid ID parameter",
      });
      return;
    }

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
      return;
    }

    await prisma.application.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Application with ID ${id} has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};
