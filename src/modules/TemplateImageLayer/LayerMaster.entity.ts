import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CommonEntity } from '../../entities/common.entity';
import { Layer } from './TemplateImageLayer.entity';

@Entity()
class LayerMaster extends CommonEntity {
  @PrimaryGeneratedColumn()
  layerMasterId: number;

  @Column({
    type: 'varchar',
    length: 63,
  })
  layerMasterName: string;

  @Column({
    type: 'varchar',
    length: 63,
  })
  layerMasterDisplayName: string;

  @OneToMany(type => Layer, layer => layer.layerId)
  layer: Layer;
}

export { LayerMaster };
