import { AppDataSource } from "../config/data-source";
import { Option } from "../models/Option";
import { Poll } from "../models/Poll";
import { User } from "../models/User";

const optionRepository = AppDataSource.getRepository(Option);

export const optionService = {
  //get by poll
  async getOptionsByPoll(poll: Poll) {
    return await optionRepository.find({
      relations: { poll: true },
      where: { poll: { id: poll.id } },
    });
  },

  //add to poll
  async addOptionToPoll(text: string, poll: Poll) {
    const option = new Option();
    option.text = text;
    option.poll = poll;
    option.votes = [];
    return await optionRepository.save(option);
  },

  //remove from poll
  async removeOptionFromPoll(id: string) {
    const option = await optionRepository.findOneBy({ id: parseInt(id, 10) });
    if (option) {
      await optionRepository.remove(option);
    }
  },

  //update
  async updateOption(id: string, text: string) {
    const option = await optionRepository.findOneBy({ id: parseInt(id, 10) });
    if (option) {
      option.text = text;
      await optionRepository.save(option);
    }
  },
};
