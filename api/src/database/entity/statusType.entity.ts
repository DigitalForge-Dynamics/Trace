import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity('status_types')
export class StatusType {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar', unique: true })
    declare name: string;

    @Column({ type: 'text', nullable: true })
    declare description: string | null;

    @OneToMany(() => Asset, (asset) => asset.status)
    declare assets: Asset[];

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}