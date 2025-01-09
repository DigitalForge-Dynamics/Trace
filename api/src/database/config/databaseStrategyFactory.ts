import { IDatabaseStrategy } from "./IDatabaseStrategy";
import { PostgresStrategy } from "./strategies/postgresStrategy";

export class DatabaseStrategyFactory {
    private strategy: IDatabaseStrategy;

    constructor() {
        const dbType = "postgres";

        switch(dbType) {
            case "postgres":
                this.strategy = new PostgresStrategy();
                break;
            default:
                throw new Error(`Unsupported database type`);
        }
    }

    get currentStrategy(): IDatabaseStrategy {
        return this.strategy;
    }
}