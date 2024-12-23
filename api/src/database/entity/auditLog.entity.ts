import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'enum', enum: ['create', 'update', 'delete', 'login', 'logout'] })
    declare type: string;

    @Column({ type: 'varchar' })
    declare entry: string;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;
}