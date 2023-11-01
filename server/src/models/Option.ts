import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Poll } from "./Poll";
import { User } from "./User";

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.options, {
    cascade: true,
  })
  poll: Poll;

  @OneToMany(() => User, (user) => user.id)
  votes: User[];
}
