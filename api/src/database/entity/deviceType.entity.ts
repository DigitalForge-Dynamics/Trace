import { Column, Entity, OneToMany } from "typeorm";
import { Asset } from "./asset.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('device_types')
export class DeviceType extends SharedContext {
    @Column({ type: 'varchar' })
    declare category: string;

    @OneToMany(() => Asset, (asset) => asset.device_type)
    declare assets: Asset[];

}