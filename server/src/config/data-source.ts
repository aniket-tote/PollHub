import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Poll } from "../models/Poll";
import { Option } from "../models/Option";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT as string, 10) || 3306,
  username: process.env.MYSQL_USERNAME || "root",
  password: process.env.MYSQL_PASSWORD || "Pass@6471",
  database: process.env.MYSQL_DATABASE || "poll_portal",
  synchronize: true,
  logging: false,
  entities: [User, Poll, Option],
  migrations: [],
  subscribers: [],
});
