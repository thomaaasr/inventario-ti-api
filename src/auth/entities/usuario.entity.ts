import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Nunca guardamos a senha em si, só o resultado do bcrypt (hash).
  @Column()
  senhaHash: string;
}
