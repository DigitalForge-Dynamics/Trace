import { IDatabaseStrategy } from "./IDatabaseStrategy";
import { PostgresStrategy } from "./strategies/postgresStrategy";

export class DatabaseStrategyFactory {
    static createStrategy(): IDatabaseStrategy {
        const dbType = "postgres";

        switch(dbType) {
            case "postgres":
                return new PostgresStrategy();
            default:
                throw new Error(`Unsupported database type`);
        }
    }
}