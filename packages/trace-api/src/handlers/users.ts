import { type CreateUserResponse, createUserRequest, linkUserIdpRequest } from "@DigitalForge-Dynamics/trace-schemas";
import { db } from "../db.ts";

const createUser = async (req: Request): Promise<Response> => {
  const userRequest = createUserRequest.parse(await req.json());
  const user = await db.createUser(userRequest);
  return Response.json(user satisfies CreateUserResponse);
};

const linkUserIdp = async (req: Request): Promise<Response> => {
  const linkRequest = linkUserIdpRequest.parse(await req.json());
  let idpId: string;
  if (linkRequest.idp instanceof URL) {
    const idp = await db.findIdp(linkRequest.idp);
    if (idp === null) {
      return Response.json({ error: "Unknown IdP" }, { status: 400 });
    }
    idpId = idp.uid;
  } else {
    idpId = linkRequest.idp;
  }
  await db.linkUser(linkRequest.userId, idpId, linkRequest.sub);
  return new Response(null, { status: 204 });
};

export { createUser, linkUserIdp };
