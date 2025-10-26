import { z } from "zod";

const healthCheckResponse = z.strictObject({
	health: z.literal("OK"),
}).readonly();

type HealthCheckResponse = z.infer<typeof healthCheckResponse>;

const errorResponse = z.strictObject({
	message: z.string(),
}).readonly();

type ErrorResponse = z.infer<typeof errorResponse>;

export type { HealthCheckResponse, ErrorResponse };
export { healthCheckResponse, errorResponse };
