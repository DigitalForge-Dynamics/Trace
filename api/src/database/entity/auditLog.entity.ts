import { Column, Entity } from "typeorm";
import { SharedContext } from "./sharedContext.entity";

@Entity('audit_logs')
export class AuditLog extends SharedContext {
    @Column({ type: 'enum', enum: ['create', 'update', 'delete', 'login', 'logout'] })
    declare type: string;

    @Column({ type: 'varchar' })
    declare entry: string;
}