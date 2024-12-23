import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Location } from "./location.entity";
import { DeviceType } from "./deviceType.entity";

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare assetTag: string;

    @Column({ type: 'varchar' })
    declare name: string;

    @Column({ type: 'varchar', nullable: true })
    declare serialNumber: string;

    @Column({ type: 'varchar', nullable: true })
    declare modelNumber: string;

    // declare status: void;

    @ManyToOne(() => DeviceType, (deviceType) => deviceType.assets)
    declare deviceType: DeviceType;

    @Column({ type: 'date', nullable: true })
    declare nextAuditDate: Date;

    @ManyToOne(() => Location, (location) => location.assets)
    declare location: Location;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}