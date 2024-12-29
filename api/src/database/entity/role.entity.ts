import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    declare user_roles: UserRole[];

    @CreateDateColumn()
    declare created_at: Date;

    @UpdateDateColumn()
    declare updated_at: Date;
}