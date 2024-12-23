import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: 'varchar' })
    declare assetTag: string;

    @Column({ type: 'varchar' })
    declare name: string;

    @Column({ type: 'varchar', nullable: true })
    declare serialNumber: string;

    @Column({ type: 'varchar', nullable: true })
    declare modelNumber: string;

    // declare status: void;

    // @ManyToOne()
    // declare deviceType: void;

    @Column({ type: 'date', nullable: true })
    declare nextAuditDate: Date;

    // @ManyToOne()
    // declare location: void;

    @CreateDateColumn()
    declare createdAt: Date;

    @CreateDateColumn()
    declare updatedAt: Date;
}