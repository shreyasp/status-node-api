import { CommonEntity } from 'entities/common.entity';
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from '../TemplateCategory/TemplateCategory.entity';

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

    @ManyToOne(
        type => Category,
        category => category.categoryId,
    )
    @JoinTable()
    category: Category;

    @Column(type => CommonEntity)
    attrs: CommonEntity;
}

export { Image };