import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Category {
    @PrimaryGeneratedColumn()
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