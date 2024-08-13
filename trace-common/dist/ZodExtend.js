"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodObjectExactOption = void 0;
const zod_1 = require("zod");
// When parsing, enforces that schemas defined with `z.optional(...)` or `[...].optional()` do not permit the presence of a value of `undefined`.
class ZodObjectExactOption extends zod_1.ZodObject {
    _parse(input) {
        const parsed = super._parse(input);
        if (parsed instanceof Promise) {
            return parsed.then((parsed) => this.__parseSync(input, parsed));
        }
        return this.__parseSync(input, parsed);
    }
    __parseSync(input, parsed) {
        if (parsed.status !== "valid")
            return parsed;
        const { value } = parsed;
        if (typeof value !== "object" || value === null) {
            return { status: "dirty", value };
        }
        const ctx = this._getOrReturnCtx(input);
        for (const key in this.shape) {
            if (!(this.shape[key] instanceof zod_1.ZodOptional)) {
                continue;
            }
            if (!(key in value)) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const tmpValue = value[key]; // Presence of key is checked on line above
            if (tmpValue === undefined) {
                const issue = {
                    code: "custom",
                    message: "Explicit 'undefined' for optional key",
                    path: [...ctx.path, key],
                    fatal: true,
                };
                (0, zod_1.addIssueToContext)(ctx, issue);
            }
        }
        return ctx.common.issues.length > 0 ? zod_1.INVALID : parsed;
    }
}
exports.ZodObjectExactOption = ZodObjectExactOption;
zod_1.ZodObject.prototype.exactOptions = function () {
    return new ZodObjectExactOption(this._def);
};
