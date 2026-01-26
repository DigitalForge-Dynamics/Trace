import {
  type CreateAssetResponse,
  createAssetRequest,
  type GetAssetResponse,
  getAssetRequest,
  type ListAssetsResponse,
} from "@DigitalForge-Dynamics/trace-schemas";
import { db } from "../db.ts";

const createAsset = async (req: Request): Promise<Response> => {
  const assetRequest = createAssetRequest.parse(await req.json());
  const asset = await db.createAsset(assetRequest);
  return Response.json(asset satisfies CreateAssetResponse["serialised"]);
};

const getAsset = async (req: Request): Promise<Response> => {
  const request = getAssetRequest.parse(await req.json());
  const asset = await db.getAsset(request.uid);
  return Response.json(asset satisfies GetAssetResponse["serialised"]);
};

// TODO: Add 'token' based pagination. Can base off times, as UUIDv7 contains a timebased component.
const listAssets = async (_req: Request): Promise<Response> => {
  const assets = await db.listAssets();
  return Response.json(assets satisfies ListAssetsResponse["serialised"]);
};

export { createAsset, getAsset, listAssets };
