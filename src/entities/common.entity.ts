import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class CommonEntity {
    @PrimaryGeneratedColumn()
    EntId: number;

    @CreateDateColumn({
        name: 'createdDate',
        select: false,
    })
    createdDate: Date;

    @UpdateDateColumn({
        name: 'updatedDate',
        select: false,
    })
    updatedDate: Date;
}

export { CommonEntity };