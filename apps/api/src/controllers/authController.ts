import { Request, Response } from "express";
import { authSchema } from "@repo/types";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "@repo/db";

// Load environment variables from .env file
dotenv.config();

export default async function authController(req: Request, res: Response) {
  try {
    console.log("control reach here");
    const parsedData = authSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw parsedData.error;
    }
    const { name, email, password } = parsedData.data;

    // Check if user already exists
    const existingUser = await prisma.tenant.findUnique({
      where: {
        email: email,
      },
    });

    console.log("jwt secret in auth controller", process.env.JWT_SECRET); // Debugging log to check the JWT secret value in authController
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid Credentials",
          status: "Unauthorized",
          statusCode: 401,
        });
      }
      // creating a JWT token for the existing user
      const token = jwt.sign(
        { tenantId: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET as string,
      );
      console.log("token length creating", token.length);
      if (token) {
        return res.status(200).json({
          message: "Login Successful",
          status: "OK",
          statusCode: 200,
          token: token,
        });
      }
    }

    // Hashing the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.tenant.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (user) {
      // creating a JWT token for the new user
      const token = jwt.sign(
        { tenantId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
      );
      console.log("token length creating", token.length);
      if (token) {
        return res.status(201).json({
          message: "User Created and Login Successful",
          status: "Created",
          statusCode: 201,
          token: token,
        });
      }
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation Error",
        errors: error.flatten().fieldErrors,
        status: "Bad Request",
        statusCode: 400,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        status: "Error",
        statusCode: 500,
        error: error,
      });
    }
  }
}
