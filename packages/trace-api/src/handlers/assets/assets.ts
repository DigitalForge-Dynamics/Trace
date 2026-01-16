import type { AssetListResponse } from "trace-schemas/src/assets/response";
import { db } from "../../db"

const getAssets = async (): Promise<Response> => {
    const assets = await db.listAssets();
    return Response.json({ data: assets } satisfies AssetListResponse)
}

export { getAssets }