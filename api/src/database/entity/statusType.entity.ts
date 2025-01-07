import { Column, Entity, OneToMany } from "typeorm";
import { Asset } from "./asset.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('status_types')
export class StatusType extends SharedContext {
    @Column({ type: 'varchar', unique: true })
    declare name: string;

    @Column({ type: 'text', nullable: true })
    declare description: string | null;

    @OneToMany(() => Asset, (asset) => asset.status)
    declare assets: Asset[];

}