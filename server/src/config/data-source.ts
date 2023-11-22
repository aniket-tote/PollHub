import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Poll } from "../models/Poll";
import { Option } from "../models/Option";
import { Vote } from "../models/Vote";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT as string, 10) || 3306,
  username: process.env.MYSQL_USERNAME || "",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "",
  synchronize: true,
  logging: false,
  entities: [User, Poll, Option, Vote],
  migrations: [],
  subscribers: [],
});
