import type { z, ZodType } from "zod";

type DTO<TSchema extends ZodType> = {
  readonly serialised: z.input<TSchema>;
  readonly parsed: z.output<TSchema>;
};

export type { DTO };
