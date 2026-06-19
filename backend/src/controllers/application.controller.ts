import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { createApplicationSchema, updateApplicationSchema } from "../validation/application.validation";

// Create a new application
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

// Retrieve all applications
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

    // Get total count for pagination metadata
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

// Retrieve a single application by ID
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

// Update an application by ID
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

    // Check if the application exists first
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

// Delete an application by ID
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

    // Check if the application exists first
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
