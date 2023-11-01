import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from "typeorm";
import { Option } from "./Option";
import { User } from "./User";

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  closeTime: Date;

  @OneToMany(() => Option, (option) => option.poll, {
    eager: true,
  })
  options: Option[];

  @ManyToOne(() => User, (user) => user.polls)
  user: User;
}
