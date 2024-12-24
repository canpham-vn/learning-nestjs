import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from './property.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: '' })
  avatarUrl: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ default: '' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @ManyToMany(() => Property, (property) => property.likedBy)
  @JoinTable({ name: 'user_liked_properties' })
  likedProperties: Property[];

  /*
   * Sử dụng trigger để hasing password trước khi insert vào db
   */
  @BeforeInsert()
  async hashPassword() {
    /*
     * Tham số thứ 2 trong hàm hash là salt round
     * Thể hiện đô phực tạp của hasing password, số càng lớn độ phức tạp càng cao
     * nhưng cần cân nhắc vì càng phức tạp tốc độ sẽ càng chậm
     */
    this.password = await bcrypt.hash(this.password, 10);
  }
}
