import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyFeature } from './propertyFeature.entity';
import { User } from './user.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  price: number;

  // --- Register foreign: one to one relationship with PropertyFeature entity ---
  @OneToOne(
    () => PropertyFeature,
    (propertyFeature) => propertyFeature.property,
    // --- If we remove the property instance, DB will automatically remove the associated property feature
    { cascade: true },
  )
  propertyFeature: PropertyFeature;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'ownerId' })
  user: User;
}
