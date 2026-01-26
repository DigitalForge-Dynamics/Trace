import { z } from "zod";

const createLocationRequest = z.strictObject({
  name: z.string(),
});

const createLocationResponse = z.strictObject({
  id: z.uuidv7(),
});

type CreateLocationRequest = z.infer<typeof createLocationRequest>;
type CreateLocationResponse = z.infer<typeof createLocationResponse>;

export type { CreateLocationRequest, CreateLocationResponse };
export { createLocationRequest, createLocationResponse };
