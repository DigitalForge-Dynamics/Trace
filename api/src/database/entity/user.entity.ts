import { UUID } from "crypto";
import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./userRole.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('users')
export class User extends SharedContext {
    @Column({ type: 'uuid' })
    declare uuid: UUID;

    @Column({ type: 'varchar' })
    declare first_name: string;

    @Column({ type: 'varchar' })
    declare last_name: string;

    @Column({ type: 'varchar', unique: true })
    declare username: string;

    @Column({ type: 'varchar' })
    declare password: string;

    @Column({ type: 'varchar', unique: true })
    declare email: string;

    @Column({ type: 'boolean', default: false })
    declare has_console_access: boolean;

    @Column({ type: 'varchar', nullable: true })
    declare mfa_secret: string;

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    declare user_roles: UserRole[];

}