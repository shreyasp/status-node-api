import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';

@Entity()
class Font extends CommonEntity {
  @PrimaryGeneratedColumn()
  fontId: number;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  fontName: string;

  @Column({
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  fontExtension: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  fontPath: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}

export { Font };
