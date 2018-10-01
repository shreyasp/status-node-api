import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Layer } from '../TemplateImageLayer/TemplateImageLayer.entity';

@Entity()
class Image extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  templateUrl: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  templateBackgroundUrl: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(type => Category, category => category.id)
  category: Category;

  @OneToMany(type => Layer, layer => layer.image)
  @JoinTable()
  layers: Layer[];
}

export { Image };
