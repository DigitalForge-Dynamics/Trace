import { z } from "zod";
import type { DTO } from "./util.ts";

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

const getAssetResponse = assetResponse.nullable();

const moveAssetRequest = z.strictObject({
  asset: z.uuidv7(),
  location: z.uuidv7(),
});

const assignAssetRequest = z.strictObject({
  asset: z.uuidv7(),
  user: z.uuidv7(),
});

type CreateAssetRequest = DTO<typeof createAssetRequest>;
type CreateAssetResponse = DTO<typeof createAssetResponse>;
type ListAssetsResponse = DTO<typeof listAssetsResponse>;
type GetAssetRequest = DTO<typeof getAssetRequest>;
type GetAssetResponse = DTO<typeof getAssetResponse>;
type MoveAssetRequest = DTO<typeof moveAssetRequest>;
type AssignAssetRequest = DTO<typeof assignAssetRequest>;

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
