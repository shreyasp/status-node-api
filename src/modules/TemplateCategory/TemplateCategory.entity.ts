import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Image } from '../TemplateImage/TemplateImage.entity';

@Entity()
class Category extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  displayName: string;

  @OneToMany(type => Image, image => image.id)
  image: Image;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}

export { Category };
