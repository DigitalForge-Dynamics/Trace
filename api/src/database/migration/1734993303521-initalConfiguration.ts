import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitalConfiguration1734993303521 implements MigrationInterface {
    private tenantSchema = 'trace_default';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(`${this.tenantSchema}`, true);
        
        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.status_type`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'name', type: 'varchar', isUnique: true, isNullable: false },
                { name: 'description', type: 'varchar', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.assets`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'asset_tag', type: 'varchar', isNullable: false },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'serial_number', type: 'varchar', isNullable: false },
                { name: 'model_number', type: 'varchar', isNullable: true },
                { name: 'status_type_id', type: 'int', isNullable: false },
                { name: 'next_audit_date', type: 'date', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ],
            foreignKeys: [
                {
                    columnNames: ['status_type_id'],
                    referencedTableName: `${this.tenantSchema}.status_type`,
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`${this.tenantSchema}.locations`)
    }

}
