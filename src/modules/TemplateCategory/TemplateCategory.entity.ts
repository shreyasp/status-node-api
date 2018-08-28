import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Category {
    @PrimaryGeneratedColumn('uuid')
    categoryId: string;

    @Column({
        type: 'varchar',
        length: 64,
        unique: true,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 64,
        unique: true,
    })
    displayName: string;

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}

export { Category };