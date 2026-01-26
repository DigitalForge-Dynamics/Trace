import {
  type CreateAssetResponse,
  createAssetRequest,
  type GetAssetResponse,
  getAssetRequest,
  type ListAssetsResponse,
} from "@DigitalForge-Dynamics/trace-schemas";
import type { BunRequest } from "bun";
import { db } from "../db.ts";

const createAsset = async (req: Request): Promise<Response> => {
  const assetRequest = createAssetRequest.parse(await req.json());
  const asset = await db.createAsset({ locationId: assetRequest.location });
  return Response.json({ id: asset.uid } satisfies CreateAssetResponse);
};

const getAsset = async (req: BunRequest & { params: { id: string } }): Promise<Response> => {
  const request = getAssetRequest.parse(req.params);
  const asset = await db.getAsset(request.id);
  if (asset === null) {
    return new Response(null, { status: 404 });
  }
  return Response.json({
    id: asset.uid,
    location: asset.location,
    user: asset.user,
  } satisfies GetAssetResponse);
};

// TODO: Add 'token' based pagination. Can base off times, as UUIDv7 contains a timebased component.
const listAssets = async (_req: Request): Promise<Response> => {
  const assets = await db.listAssets();
  return Response.json(
    assets.map((asset) => ({
      id: asset.uid,
      location: asset.location,
      user: asset.user,
    })) satisfies ListAssetsResponse,
  );
};

export { createAsset, getAsset, listAssets };
