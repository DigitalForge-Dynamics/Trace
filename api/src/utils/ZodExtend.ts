import {
  INVALID, ParseInput, ParseReturnType, SyncParseReturnType, UnknownKeysParam,
  ZodIssue, ZodObject, ZodOptional, ZodRawShape, ZodTypeAny,
  addIssueToContext, objectInputType, objectOutputType
} from "zod";

// When parsing, enforces that schemas defined with `z.optional(...)` or `[...].optional()` do not permit the presence of a value of `undefined`.
export class ZodObjectExactOption<
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output extends object = objectOutputType<T, Catchall, UnknownKeys>,
  Input extends object = objectInputType<T, Catchall, UnknownKeys>,
> extends ZodObject<T, UnknownKeys, Catchall, Output, Input> {

  override _parse(input: ParseInput): ParseReturnType<this["_output"]> {
    const parsed = super._parse(input);
    if (parsed instanceof Promise) {
      return parsed.then((parsed) => this.__parseSync(input, parsed));
    }
    return this.__parseSync(input, parsed);
  }

  private __parseSync(input: ParseInput, parsed: SyncParseReturnType<this["_output"]>): ParseReturnType<this["_output"]> {
    if (parsed.status !== "valid") return parsed;
    const { value } = parsed;
    if (typeof value !== "object" || value === null) {
      return { status: "dirty", value };
    }
    const ctx = this._getOrReturnCtx(input);
    for (const key in this.shape) {
      if (!(this.shape[key] instanceof ZodOptional)) {continue;}
      if (!(key in value)) {continue;}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      const tmpValue = (value as any)[key]; // Presence of key is checked on line above
      if (tmpValue === undefined) {
        const issue: ZodIssue = {
          code: "custom",
          message: "Explicit 'undefined' for optional key",
          path: [ ...ctx.path, key ],
          fatal: true,
        };
        addIssueToContext(ctx, issue);
      }
    }
    return ctx.common.issues.length > 0 ? INVALID : parsed;
  }
}
