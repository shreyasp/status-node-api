import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(type => LayerStyle, {
    cascade: true,
  })
  @JoinColumn()
  style: LayerStyle;

  @OneToOne(type => LayerFont, {
    cascade: true,
  })
  @JoinColumn()
  font: LayerFont;

  @OneToOne(type => LayerFrame, {
    cascade: true,
  })
  @JoinColumn()
  frame: LayerFrame;

  @ManyToOne(type => Image, image => image.layers)
  image: Image;
}

export { Layer, LayerFont, LayerFrame, LayerStyle };
