import { Request, Response } from "express";
import prisma from "../prisma";

export const testDbConnection = async (req: Request, res: Response): Promise<void> => {
  try {
    // Run a simple query to check the database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Database connection verified successfully!",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: "Failed to connect to the database.",
      error: errorMessage,
    });
  }
};
