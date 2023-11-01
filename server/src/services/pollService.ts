import { AppDataSource } from "../config/data-source";
import { Option } from "../models/Option";
import { Poll } from "../models/Poll";
import { User } from "../models/User";

const pollRepository = AppDataSource.getRepository(Poll);
const optionRepository = AppDataSource.getRepository(Option);

export const pollService = {
  //get all
  async getAllPolls() {
    return await pollRepository.find();
  },

  //get by id
  async getPollById(id: string) {
    return await pollRepository.findOneBy({ id: parseInt(id, 10) });
  },

  //add
  async createPoll(
    question: string,
    name: string,
    createdAt: Date,
    closeTime: Date,
    options: string[],
    user: User
  ) {
    const newPoll = new Poll();
    newPoll.question = question;
    newPoll.name = name;
    newPoll.createdAt = createdAt;
    newPoll.closeTime = closeTime;
    newPoll.user = user;

    const savedPoll = await pollRepository.save(newPoll);

    options.map(async (option: any) => {
      const newOption = new Option();
      newOption.text = option;
      newOption.poll = savedPoll;
      await optionRepository.save(newOption);
    });

    return savedPoll;
  },
};
