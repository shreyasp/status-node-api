import { CommonEntity } from 'entities/common.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Layer } from '../TemplateImageLayer/TemplateImageLayer.entity';

@Entity()
class Image {
  @PrimaryGeneratedColumn()
  imageId: number;

  @Column({
    type: 'varchar',
    length: 64,
  })
  imageName: string;

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

  @ManyToOne(type => Category, category => category.categoryId)
  @JoinTable()
  category: Category;

  @OneToMany(type => Layer, layer => layer.layerId)
  layer: Layer;

  @Column(type => CommonEntity)
  attrs: CommonEntity;
}

export { Image };
