import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Image } from '../TemplateImage/TemplateImage.entity';

@Entity()
class LayerStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  color: string;

  @Column({
    nullable: true,
  })
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
  fontName: string;

  @Column({
    nullable: true,
    type: 'float',
  })
  fontSize: number;
}

@Entity()
class Layer extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @Column({
    nullable: true,
  })
  text: string;

  @Column()
  type: string;

  @Column()
  isActive: boolean;

  @ManyToOne(type => Image, image => image.layers)
  image: Image;
}

export { Layer, LayerFont, LayerFrame, LayerStyle };
