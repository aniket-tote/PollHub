import { AppDataSource } from "../config/data-source";
import { Poll } from "../models/Poll";
import { User } from "../models/User";
import { optionService } from "./optionService";

const pollRepository = AppDataSource.getRepository(Poll);

export const pollService = {
  //get all
  async getAllPolls() {
    return await pollRepository.find();
  },

  //get by id
  async getPollById(id: string) {
    return await pollRepository.findOneBy({ id: parseInt(id, 10) });
  },

  //get by user
  async getPollsByUser(user: User) {
    return await pollRepository.find({
      where: { user: { id: user.id } },
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

    const savedPoll = await pollRepository.save(newPoll);

    options.map(async (optionText: any) => {
      optionService.addOptionToPoll(optionText, savedPoll);
    });

    return savedPoll;
  },
};
