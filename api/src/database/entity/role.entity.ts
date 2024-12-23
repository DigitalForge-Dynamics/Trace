import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./userRole.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ unique: true })
    declare name: string;

    @Column({ type: 'text', nullable: true })
    declare description: string;

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    declare userRoles: UserRole[];

    @CreateDateColumn()
    declare createdAt: Date;

    @CreateDateColumn()
    declare updatedAt: Date;
}