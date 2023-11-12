import { Request, Response } from "express";
import { userService } from "../services/userService";
import { MyError } from "../util/MyError";

export const UserController = {
  //get all
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      if (users.length == 0) {
        return res.status(404).json({ error: "No Users Found" });
      }
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //get by id
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user == null) {
        return res
          .status(404)
          .json({ error: "User Not Found with Id: " + req.params.id });
      }
      return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //update
  async updateUser(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Invalid Request Body" });
      }
      const user = await userService.updateUser(req.params.id, { name, email });
      return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      if (error instanceof MyError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
