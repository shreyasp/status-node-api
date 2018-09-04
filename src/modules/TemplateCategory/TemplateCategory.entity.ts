import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CommonEntity } from '../../entities/common.entity';

@Entity()
class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

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

    @Column(type => CommonEntity)
    common: CommonEntity;
}

export { Category };