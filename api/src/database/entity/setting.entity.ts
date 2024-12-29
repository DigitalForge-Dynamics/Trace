import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare category: string;

    @Column({ type: 'jsonb' })
    declare category_data: object;

    @Column({ type: 'varchar', nullable: true })
    declare description: string;

    @CreateDateColumn()
    declare created_at: Date;

    @UpdateDateColumn()
    declare updated_at: Date;
}