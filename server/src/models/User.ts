import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Poll } from "./Poll";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Poll, (poll) => poll.user)
  polls: Poll[];
}
