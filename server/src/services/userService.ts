import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { MyError } from "../util/MyError";
import * as CryptoJS from "crypto-js";

const userRepository = AppDataSource.getRepository(User);

const PASSWORD_SECRET = process.env.PASSWORD_SECRET || "";

export const userService = {
  //get all
  async getAllUsers() {
    return await userRepository.find({ select: ["id", "name", "email"] });
  },

  //get by id
  async getUserById(id: string) {
    return await userRepository.findOneBy({ id: parseInt(id, 10) });
  },

  //add
  async addUser(userData: { name: string; email: string; password: string }) {
    const user = await userRepository.find({
      where: { email: userData.email },
    });
    console.log(user);
    if (user.length > 0) {
      throw new MyError("User already exists with email: " + userData.email);
    }
    const newUser = new User();
    newUser.name = userData.name;
    newUser.email = userData.email;
    newUser.password = CryptoJS.AES.encrypt(
      userData.password,
      PASSWORD_SECRET
    ).toString();

    return await userRepository.save(newUser);
  },

  //update
  async updateUser(id: string, userData: { name: string; email: string }) {
    const user = await userRepository.findOneBy({ id: parseInt(id, 10) });
    if (user == null) {
      throw new MyError("User not found with id: " + id);
    }
    user.name = userData.name;
    user.email = userData.email;
    return await userRepository.save(user);
  },

  //get by id and password
  async getUserByIdAndPassword(userData: { email: string; password: string }) {
    const user = await userRepository.findOneBy({ email: userData.email });
    if (user == null) {
      throw new MyError("User not found with email: " + userData.email);
    }
    const bytes = CryptoJS.AES.decrypt(user.password, PASSWORD_SECRET);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== userData.password) {
      throw new MyError("Invalid password");
    }
    return user;
  },
};
