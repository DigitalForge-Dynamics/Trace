import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare category: string;

    @Column({ type: 'jsonb' })
    declare categoryData: object;

    @Column({ type: 'varchar', nullable: true })
    declare description: string;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}