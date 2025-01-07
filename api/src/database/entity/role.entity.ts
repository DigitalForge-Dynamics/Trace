import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./userRole.entity";
import { SharedContext } from "./sharedContext.entity";

@Entity('roles')
export class Role extends SharedContext {
    @Column({ unique: true })
    declare name: string;

    @Column({ type: 'text', nullable: true })
    declare description: string;

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    declare user_roles: UserRole[];
}