import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class SharedContext {
        @PrimaryGeneratedColumn()
        declare id: number;

        @CreateDateColumn()
        declare created_at: Date;
    
        @UpdateDateColumn()
        declare updated_at: Date;
}