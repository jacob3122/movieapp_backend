import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'phNumber',
    nullable: false,
  })
  phNumber: string;

  @Column({
    name: 'access_token',
    nullable: true,
  })
  access_token: string;
}
