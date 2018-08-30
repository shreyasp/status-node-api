import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CommonEntity } from '../../entities/common.entity';

@Entity()
class Font {
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

   @Column(type => CommonEntity)
   common: CommonEntity;
}

export { Font };