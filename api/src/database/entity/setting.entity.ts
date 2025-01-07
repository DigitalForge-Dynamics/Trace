import { Column, Entity } from "typeorm";
import { SharedContext } from "./sharedContext.entity";

@Entity('settings')
export class Setting extends SharedContext {
    @Column({ type: 'varchar' })
    declare category: string;

    @Column({ type: 'jsonb' })
    declare category_data: object;

    @Column({ type: 'varchar', nullable: true })
    declare description: string;

}