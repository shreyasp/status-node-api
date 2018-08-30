import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class CommonEntity {
    @PrimaryGeneratedColumn()
    EntId: number;

    @Column({
        name: 'isActive',
    })
    isActive: boolean;

    @CreateDateColumn({
        name: 'createdDate',
    })
    createdDate: Date;

    @UpdateDateColumn({
        name: 'updatedDate',
    })
    updatedDate: Date;
}

export { CommonEntity };