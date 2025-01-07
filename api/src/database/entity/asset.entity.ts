import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Location } from "./location.entity";
import { DeviceType } from "./deviceType.entity";
import { StatusType } from "./statusType.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('assets')
export class Asset extends SharedContext {
    @Column({ type: 'varchar' })
    declare asset_tag: string;

    @Column({ type: 'varchar' })
    declare name: string;

    @Column({ type: 'varchar', nullable: true })
    declare serial_number: string;

    @Column({ type: 'varchar', nullable: true })
    declare model_number: string;

    @ManyToOne(() => StatusType, (status) => status.assets, { nullable: false })
    @JoinColumn({ name: 'status_types_id' })
    declare status: StatusType;

    @ManyToOne(() => DeviceType, (deviceType) => deviceType.assets)
    declare device_type: DeviceType;

    @Column({ type: 'date', nullable: true })
    declare next_audit_date: Date;

    @ManyToOne(() => Location, (location) => location.assets)
    declare location_id: Location;

}