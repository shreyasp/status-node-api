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
  appName: string;

  @Column({
    type: 'decimal',
    default: 0,
  })
  majorVersion: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  minorVersion: number;

  @Column({
    type: 'decimal',
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
