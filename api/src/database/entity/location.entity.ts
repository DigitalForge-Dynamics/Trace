import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare location_name: string;

    @Column({ type: 'json', nullable: true })
    declare geo_location: object;

    @Column({ type: 'boolean', default: false })
    declare primary_location: boolean;

    @OneToMany(() => Asset, (asset) => asset.location_id)
    declare assets: Asset[];

    @CreateDateColumn()
    declare created_at: Date;

    @UpdateDateColumn()
    declare updated_at: Date;
}