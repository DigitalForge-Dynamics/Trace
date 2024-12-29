import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitalConfiguration1734993303521 implements MigrationInterface {
    private tenantSchema = 'trace_default';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(`${this.tenantSchema}`, true);
        
        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.status_types`,
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
                { name: 'device_type_id', type: 'int', isNullable: false },
                { name: 'next_audit_date', type: 'date', isNullable: true },
                { name: 'location_id', type: 'int', isNullable: false },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ],
            foreignKeys: [
                {
                    columnNames: ['status_type_id'],
                    referencedTableName: `${this.tenantSchema}.status_types`,
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL',
                },
                {
                    columnNames: ['device_type_id'],
                    referencedTableName: `${this.tenantSchema}.device_types`,
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL'
                },
                {
                    columnNames: ['location_id'],
                    referencedTableName: `${this.tenantSchema}.locations`,
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL'
                }
            ]
        }));

        await queryRunner.query(`CREATE TYPE audit_log_type_enum AS ENUM ('create', 'update', 'delete', 'login', 'logout')`)

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.audit_logs`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'type', type: 'audit_log_type_enum', isNullable: false },
                { name: 'entry', type: 'varchar', isNullable: false },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.device_types`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'category', type: 'varchar', isNullable: false },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.locations`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'location_name', type: 'varchar', isNullable: false },
                { name: 'geo_location', type: 'json', isNullable: true },
                { name: 'primary_location', type: 'boolean', default: false },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.roles`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'name', type: 'varchar', isUnique: true, isNullable: false },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ],
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.settings`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'category', type: 'varchar', isNullable: false },
                { name: 'category_data', type: 'jsonb', isNullable: false },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.status_types`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.users`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'uuid', type: 'uuid', isUnique: true, isNullable: false },
                { name: 'first_name', type: 'varchar', isNullable: true },
                { name: 'last_name', type: 'varchar', isNullable: false },
                { name: 'username', type: 'varchar', isUnique: true, isNullable: false },
                { name: 'password', type: 'varchar', isNullable: true },
                { name: 'email', type: 'varchar', isNullable: false },
                { name: 'has_console_access', type: 'boolean', default: false },
                { name: 'mfa_secret', type: 'varchar', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ],
            indices: [
                {
                    name: 'idx_users_username',
                    columnNames: ['username'],
                    isUnique: true,
                },
                {
                    name: 'idx_users_email',
                    columnNames: ['email'],
                    isUnique: true
                }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: `${this.tenantSchema}.user_roles`,
            columns: [
                { name: 'id', type: 'serial', isPrimary: true },
                { name: 'user_id', type: 'int', isNullable: false },
                { name: 'role_id', type: 'int', isNullable: false }
            ],
            foreignKeys: [
                {
                    columnNames: ['user_id'],
                    referencedTableName: `${this.tenantSchema}.users`,
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                },
                {
                    columnNames: ['role_id'],
                    referencedTableName: `${this.tenantSchema}.roles`,
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                }
            ],
            indices: [
                {
                    name: 'idx_user_roles_user_role',
                    columnNames: ['user_id', 'role_id'],
                    isUnique: true
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
