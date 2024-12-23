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
    declare firstName: string;

    @Column({ type: 'varchar' })
    declare lastName: string;

    @Column({ type: 'varchar', unique: true })
    declare username: string;

    @Column({ type: 'varchar' })
    declare password: string;

    @Column({ type: 'varchar', unique: true })
    declare email: string;

    @Column({ type: 'boolean', default: false })
    declare hasConsoleAccess: boolean;

    @Column({ type: 'varchar', nullable: true })
    declare mfaSecret: string;

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    declare userRoles: UserRole[];

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}