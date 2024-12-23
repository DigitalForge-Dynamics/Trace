import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare locationName: string;

    @Column({ type: 'json', nullable: true })
    declare geoLocation: object;

    @Column({ type: 'boolean', default: false })
    declare primaryLocation: boolean;

    @OneToMany(() => Asset, (asset) => asset.location)
    declare assets: Asset[];

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}