import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Image } from '../TemplateImage/TemplateImage.entity';

@Entity()
class LayerStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  opacity: number;
}

@Entity()
class LayerFrame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
  })
  height: number;

  @Column({
    type: 'float',
  })
  width: number;

  @Column({
    type: 'float',
  })
  x: number;

  @Column({
    type: 'float',
  })
  y: number;
}

@Entity()
class LayerFont {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  size: number;
}

@Entity()
class Layer {
  @PrimaryGeneratedColumn()
  layerId: number;

  @Column()
  layerName: string;

  @Column({
    nullable: true,
  })
  alignment: string;

  @Column(type => LayerFrame)
  frame: LayerFrame;

  @Column(type => LayerFont)
  font: LayerFont;

  @Column(type => LayerStyle)
  style: LayerStyle;

  @Column()
  layerParent: string;

  @Column()
  text: string;

  @Column()
  type: string;

  @Column()
  isActive: boolean;

  @Column(type => CommonEntity)
  attrs: CommonEntity;

  @ManyToOne(type => Image, image => image.imageId)
  @JoinTable()
  image: Image;
}

export { Layer, LayerFont, LayerFrame, LayerStyle };
