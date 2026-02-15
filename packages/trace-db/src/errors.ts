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

class ExistingEntityError extends Error {
  readonly table: string;
  readonly id: string;
  constructor(table: string, id: string) {
    super(`Existing entry in ${table} with id ${id}.`);
    this.table = table;
    this.id = id;
  }
}

class MissingEntityError extends Error {
  readonly table: string;
  readonly id: string;
  constructor(table: string, id: string) {
    super(`Missing entry in ${table} with id ${id}.`);
    this.table = table;
    this.id = id;
  }
}

class ConflictingConstraintError extends Error {
  readonly table: string;
  readonly requested: string;
  readonly existing: string;
  constructor(table: string, requested: string, existing: string) {
    super(`Conflicting constraint in ${table}, with adding ${requested} to existing ${existing}.`);
    this.table = table;
    this.requested = requested;
    this.existing = existing;
  }
}

export { MigrationModificationError, ExistingEntityError, MissingEntityError, ConflictingConstraintError };
