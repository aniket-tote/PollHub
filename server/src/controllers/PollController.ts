import { Request, Response } from "express";
import { pollService } from "../services/pollService";
import { MyError } from "../util/MyError";
import { optionService } from "../services/optionService";

export const PollController = {
  //get all
  async getAllPolls(req: Request, res: Response) {
    try {
      const polls = await pollService.getAllPolls();
      if (polls.length == 0) {
        return res.status(404).json({ error: "No Polls Found" });
      }
      return res.json(polls);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  //get by id
  async getPollById(req: Request, res: Response) {
    try {
      const poll = await pollService.getPollById(req.params.id);
      if (poll == null) {
        return res
          .status(404)
          .json({ error: "Poll Not Found with Id: " + req.params.id });
      }
      return res.json(poll);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  //get by user
  async getPollsByUser(req: Request, res: Response) {
    try {
      const user = req.user;
      const polls = await pollService.getPollsByUser(user);
      if (polls.length == 0) {
        return res.status(404).json({ error: "No Polls Found" });
      }
      return res.json(polls);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  //create
  async createPoll(req: Request, res: Response) {
    try {
      const { question, name, description, createdAt, closeTime, options } =
        req.body;
      const user = req.user;

      if (!question || !name || !createdAt || !closeTime || !options) {
        return res.status(400).json({ error: "Invalid Request Body" });
      }

      const poll = await pollService.createPoll(
        question,
        name,
        description,
        createdAt,
        closeTime,
        options,
        user
      );
      return res.json(poll);
    } catch (error) {
      if (error instanceof MyError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error });
    }
  },

  //vote
  async vote(req: Request, res: Response) {
    try {
      const user = req.user;
      const optionId = req.params.id;
      if (!optionId) {
        return res.status(400).json({ error: "Invalid Request Body" });
      }
      await optionService.vote(optionId, user);
      return res.json({ message: "Voted Successfully" });
    } catch (error) {
      if (error instanceof MyError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error });
    }
  },
};
