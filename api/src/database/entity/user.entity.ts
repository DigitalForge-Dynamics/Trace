import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./userRole.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    declare id: number;

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

    @CreateDateColumn()
    declare created_at: Date;

    @UpdateDateColumn()
    declare updated_at: Date;
}