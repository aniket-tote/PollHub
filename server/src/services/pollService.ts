import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Poll } from "../models/Poll";
import { User } from "../models/User";
import { optionService } from "./optionService";
import { Option } from "../models/Option";
import { Vote } from "../models/Vote";

const pollRepository = AppDataSource.getRepository(Poll);
const optionRepository = AppDataSource.getRepository(Option);

export const pollService = {
  //get all
  async getAllPolls() {
    return await pollRepository.find({
      relations: { user: true },
      select: {
        id: true,
        question: true,
        name: true,
        description: true,
        createdAt: true,
        closeTime: true,
        options: true,
        user: { name: true },
      },
    });
  },

  //get by id
  async getPollById(id: string) {
    return await pollRepository.findOneBy({ id: parseInt(id, 10) });
  },

  //get by user
  async getPollsByUser(user: User) {
    return await pollRepository.find({
      relations: { user: true },
      select: {
        id: true,
        question: true,
        name: true,
        description: true,
        createdAt: true,
        closeTime: true,
        options: true,
        user: { name: true },
      },
      where: { user: { id: user.id } },
      order: { createdAt: "DESC" },
    });
  },

  //get active polls
  async getActivePolls() {
    return await pollRepository.find({
      where: { closeTime: MoreThan(new Date()) },
    });
  },

  //get inactive polls
  async getInactivePolls() {
    return await pollRepository.find({
      relations: { user: true },
      where: { closeTime: LessThan(new Date()) },
      select: {
        id: true,
        question: true,
        name: true,
        description: true,
        createdAt: true,
        closeTime: true,
        options: true,
        user: { name: true },
      },
    });
  },

  //add
  async createPoll(
    question: string,
    name: string,
    description: string,
    createdAt: Date,
    closeTime: Date,
    options: string[],
    user: User
  ) {
    const newPoll = new Poll();
    newPoll.question = question;
    newPoll.name = name;
    newPoll.description = description;
    newPoll.createdAt = createdAt;
    newPoll.closeTime = closeTime;
    newPoll.user = user;
    newPoll.options = [];

    options.map(async (optionText: any) => {
      const option = new Option();
      option.text = optionText;
      option.votes = [];
      newPoll.options.push(option);
    });
    const savedPoll = await pollRepository.save(newPoll);

    return savedPoll;
  },

  //vote
  async vote(pollId: string, optionId: string, user: User) {
    const poll = await pollRepository.findOne({
      where: { id: parseInt(pollId) },
      relations: ["options", "options.votes", "options.votes.user"],
    });
    if (poll) {
      poll.options.forEach((option) => {
        option.votes = option.votes.filter((vote) => vote.user.id !== user.id);
      });
      const selectedOption = poll.options.find(
        (option) => option.id === parseInt(optionId)
      );

      if (selectedOption) {
        const newVote = new Vote();
        newVote.option = selectedOption;
        newVote.user = user;
        selectedOption.votes.push(newVote);
      }

      await pollRepository.save(poll);
    }
  },

  //unvote
  async unvote(pollId: string, optionId: string, user: User) {
    const poll = await pollRepository.findOne({
      where: { id: parseInt(pollId) },
    });
    if (poll) {
      poll.options.forEach((option) => {
        option.votes = option.votes.filter((vote) => vote.user.id !== user.id);
      });
      await pollRepository.save(poll);
    }
  },
};
