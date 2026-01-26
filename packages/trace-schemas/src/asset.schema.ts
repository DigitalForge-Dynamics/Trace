import { z } from "zod";

const assetResponse = z.strictObject({
  id: z.uuidv7(),
  location: z.uuidv7(),
  user: z.uuidv7().nullable(),
});

const createAssetRequest = z.strictObject({
  location: z.uuidv7(),
});

const createAssetResponse = z.strictObject({
  id: z.uuidv7(),
});

const listAssetsResponse = assetResponse.array();

const getAssetRequest = z.strictObject({
  id: z.uuidv7(),
});

// NOTE: HTTP Status codes are used to convey absence.
const getAssetResponse = assetResponse;

const moveAssetRequest = z.strictObject({
  asset: z.uuidv7(),
  location: z.uuidv7(),
});

const assignAssetRequest = z.strictObject({
  asset: z.uuidv7(),
  user: z.uuidv7(),
});

type CreateAssetRequest = z.infer<typeof createAssetRequest>;
type CreateAssetResponse = z.infer<typeof createAssetResponse>;
type ListAssetsResponse = z.infer<typeof listAssetsResponse>;
type GetAssetRequest = z.infer<typeof getAssetRequest>;
type GetAssetResponse = z.infer<typeof getAssetResponse>;
type MoveAssetRequest = z.infer<typeof moveAssetRequest>;
type AssignAssetRequest = z.infer<typeof assignAssetRequest>;

export type {
  CreateAssetRequest,
  CreateAssetResponse,
  ListAssetsResponse,
  GetAssetRequest,
  GetAssetResponse,
  MoveAssetRequest,
  AssignAssetRequest,
};
export {
  createAssetRequest,
  createAssetResponse,
  listAssetsResponse,
  getAssetRequest,
  getAssetResponse,
  moveAssetRequest,
  assignAssetRequest,
};
