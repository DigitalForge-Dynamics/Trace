import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity('device_types')
export class DeviceType {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare category: string;

    @OneToMany(() => Asset, (asset) => asset.device_type)
    declare assets: Asset[];

    @CreateDateColumn()
    declare created_at: Date;

    @UpdateDateColumn()
    declare updated_at: Date;
}