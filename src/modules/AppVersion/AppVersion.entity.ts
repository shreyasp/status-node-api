import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';

@Entity()
class AppVersion extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 16,
  })
  clientName: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  majorVersion: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  minorVersion: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  patchVersion: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}

export { AppVersion };
