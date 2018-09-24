import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'date' } })
class CommonEntity {
  @PrimaryGeneratedColumn()
  EntId: number;

  @CreateDateColumn({
    name: 'createdDate',
    select: false,
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updatedDate',
    select: false,
  })
  updatedDate: Date;
}

export { CommonEntity };
