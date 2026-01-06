class MigrationModificationError extends Error {
  readonly migration: string;
  readonly applied: string;
  readonly found: string;
  constructor(migrationName: string, appliedChecksum: string, foundChecksum: string) {
    super(`Migration file modified. Previously applied: ${appliedChecksum}. Found ${foundChecksum}.`);
    this.migration = migrationName;
    this.applied = appliedChecksum;
    this.found = foundChecksum;
  }
}

export { MigrationModificationError };
