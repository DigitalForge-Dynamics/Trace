import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity('user_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    declare id: number;

    @ManyToOne(() => User, (user) => user.user_roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    declare user: User;

    @ManyToOne(() => Role, (role) => role.user_roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    declare role: Role;
}