import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { AuditLog } from "../entity/auditLog.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const AuditLogRepository = databaseManager.getRepository(AuditLog).extend({
    /**
     * Retrives Audit log entry by Id
     * @param {number} id Audit Log Identification Number
     * @returns valid select audit log entry
     */
    getAuditEntryById(id: number) {
        return this.createQueryBuilder("audit_log")
        .where("audit_log.id = :id", { id })
        .getOne();
    }
})