import z from "zod";

// biome-ignore lint/nursery/useExplicitType: Initial definition of Assets Object which is inferred for actual Type
const assetBaseSchema = z.strictObject({
    uid: z.uuidv7(),
});

type Asset = z.infer<typeof assetBaseSchema>;

export { assetBaseSchema }
export type { Asset }