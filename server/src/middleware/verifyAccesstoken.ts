import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppDataSource } from "../config/data-source";

const accessSecret =
  process.env.ACCESS_TOKEN_SECRET || "thisisaccesstokensecret";
const userRepository = AppDataSource.getRepository(User);

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(accessToken, accessSecret) as {
      id: string;
      name: string;
      email: string;
    };
    const user = await userRepository.findOneBy({
      id: parseInt(decoded.id, 10),
    });
    if (user == null) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid access token" });
  }
}
