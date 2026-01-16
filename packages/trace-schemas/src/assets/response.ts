/** biome-ignore-all lint/nursery/useExplicitType: Temp */
import z from "zod";
import { assetBaseSchema } from "./base.ts";

const assetResponseSchema = assetBaseSchema;

const assetListResponseSchema = z.strictObject({
    data: z.array(assetBaseSchema),
});

type AssetResponse = z.infer<typeof assetResponseSchema>;
type AssetListResponse = z.infer<typeof assetListResponseSchema>;

export { assetResponseSchema, assetListResponseSchema }
export type { AssetResponse, AssetListResponse }