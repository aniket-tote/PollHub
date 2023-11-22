import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Option } from "./Option";
import { User } from "./User";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Option, (option) => option.votes, { onDelete: "CASCADE" })
  option: Option;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
