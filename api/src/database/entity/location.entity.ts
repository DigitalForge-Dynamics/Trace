import { Column, Entity, OneToMany } from "typeorm";
import { Asset } from "./asset.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('locations')
export class Location extends SharedContext {
    @Column({ type: 'varchar' })
    declare location_name: string;

    @Column({ type: 'json', nullable: true })
    declare geo_location: object;

    @Column({ type: 'boolean', default: false })
    declare primary_location: boolean;

    @OneToMany(() => Asset, (asset) => asset.location_id)
    declare assets: Asset[];

}