import { Request, Response } from "express";
import { userService } from "../services/userService";
import { MyError } from "../util/MyError";
import * as jwt from "jsonwebtoken";

const accessSecret = process.env.ACCESS_TOKEN_SECRET || "";
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "";

export const AuthController = {
  //login user
  async loginUser(req: Request, res: Response) {
    try {
      const user = await userService.getUserByIdAndPassword(req.body);
      if (user != null) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessSecret,
          { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          refreshSecret,
          { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken });
      }
    } catch (error) {
      if (error instanceof MyError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error });
    }
  },

  //logout user
  async logoutUser(req: Request, res: Response) {
    try {
      // Clear the refreshToken cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  //refresh token
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
      const decoded = jwt.verify(refreshToken, refreshSecret) as {
        id: string;
        name: string;
        email: string;
      };

      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        },
        accessSecret,
        { expiresIn: "1m" }
      );

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ error });
    }
  },

  //add
  async addUser(req: Request, res: Response) {
    try {
      const user = await userService.addUser(req.body);
      return res
        .status(201)
        .json({ message: `${user.name}. Your are registered successfully` });
    } catch (error) {
      if (error instanceof MyError) {
        return res.status(400).json({ errors: [{ msg: error.message }] });
      }
      return res.status(500).json({ error });
    }
  },
};
