import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { AuditLog } from "../entity/auditLog.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const AuditLogRepository = databaseManager.getRepository<AuditLog>(AuditLog).extend({
    /**
     * Retrives Audit log entry by Id
     * @param {number} id Audit Log Identification Number
     * @returns valid select audit log entry
     */
    getAuditEntryById(id: number): Promise<AuditLog | null> {
        return this.createQueryBuilder("audit_log")
        .where("audit_log.id = :id", { id })
        .getOne();
    }
})