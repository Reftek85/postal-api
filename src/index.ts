import { Elysia, t } from "elysia";
import { db } from "./db";
import { randomUUID } from "crypto";
import { addressEndpoints, credentials, routes } from "./schema";
import { eq, sql } from "drizzle-orm";
import { randomAlphaNumeric } from "./utils";
import { randomAlphaNumSymbol } from "./utils";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import "./env";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", () => "Refer to OpenAPI documentation for usage at /swagger")
  .post(
    "/credential",
    async ({ body }) => {
      const { serverId, name } = body;
      const uuid = randomUUID();
      const key = randomAlphaNumeric(24);
      const [{ insertId }] = await db.insert(credentials).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        type: "SMTP",
        serverId,
        name,
        uuid,
        hold: 0,
        key,
      });
      return {
        name,
        key,
        credentialId: insertId,
      };
    },
    {
      body: t.Object({
        serverId: t.Number(),
        name: t.String(),
      }),
    }
  )
  .post(
    "/address",
    async ({ body }) => {
      const { address, serverId } = body;
      const uuid = randomUUID();
      const [{ insertId }] = await db.insert(addressEndpoints).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        address,
        uuid,
        serverId,
      });
      return {
        addressId: insertId,
      };
    },
    {
      body: t.Object({ 
        address: t.String(), 
        serverId: t.Number() 
      }),
    }
  )
  .post(
    "/route",
    async ({ body }) => {
      const { name, serverId, domainId, addressId } = body;
      const uuid = randomUUID();
      const token = randomAlphaNumeric(8);
      const [{ insertId }] = await db.insert(routes).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        spamMode: "Mark",
        name,
        serverId,
        domainId,
        endpointId: addressId,
        endpointType: "AddressEndpoint",
        token,
        uuid,
        mode: "Endpoint",
      });
      return {
        routeId: insertId,
        routeEmail: `${token}@${process.env.SERVER_ROUTES_DOMAIN}`,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        serverId: t.Number(),
        domainId: t.Number(),
        addressId: t.Number(),
      }),
    }
  )
  .get("/credential/:name", async ({ params, set }) => {
    const { name } = params;
    const data = await db.query.credentials.findFirst({
      where: eq(credentials.name, name),
    });
    if (!data) {
      set.status = 404;
    }
    return data || {};
  })
  .get("/address/:address", async ({ params, set }) => {
    const { address } = params;
    const data = await db.query.addressEndpoints.findFirst({
      where: eq(addressEndpoints.address, address),
    });
    if (!data) {
      set.status = 404;
    }
    return data || {};
  })
  .get("/route/:name", async ({ params, set }) => {
    const { name } = params;
    const data = await db.query.routes.findFirst({
      where: eq(routes.name, name),
    });
    if (!data) {
      set.status = 404;
    }
    return data || {};
  }
  .post(
    "/create",
    async ({ body }) => {
      const { serverId, name, address, domainId } = body;

      // Create credential
      const credentialUUID = randomUUID();
      const credentialKey = randomAlphaNumSymbol(24);
      const [{ insertId: credentialId }] = await db.insert(credentials).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        type: "SMTP",
        serverId,
        name,
        uuid: credentialUUID,
        hold: 0,
        key: credentialKey,
      });

      // Create address
      const addressUUID = randomUUID();
      const [{ insertId: addressId }] = await db.insert(addressEndpoints).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        address,
        uuid: addressUUID,
        serverId,
      });

      // Create route
      const routeUUID = randomUUID();
      const routeToken = randomAlphaNumeric(8);
      const [{ insertId: routeId }] = await db.insert(routes).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        spamMode: "Mark",
        name,
        serverId,
        domainId,
        endpointId: addressId,
        endpointType: "AddressEndpoint",
        token: routeToken,
        uuid: routeUUID,
        mode: "Endpoint",
      });

      return {
        credential: {
          name,
          key: credentialKey,
          credentialId,
        },
        address: {
          addressId,
        },
        route: {
          routeId,
          routeEmail: `${routeToken}@${process.env.SERVER_ROUTES_DOMAIN}`,
        },
      };
    },
    {
      body: t.Object({
        serverId: t.Number(),
        name: t.String(),
        address: t.String(),
        domainId: t.Number(),
      }),
    }
  )
  .post(
    "/create",
    async ({ body }) => {
      const { serverId, name, address, domainId } = body;

      // Create credential
      const credentialUUID = randomUUID();
      const credentialKey = randomAlphaNumSymbol(24);
      const [{ insertId: credentialId }] = await db.insert(credentials).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        type: "SMTP",
        serverId,
        name,
        uuid: credentialUUID,
        hold: 0,
        key: credentialKey,
      });

      // Create address
      const addressUUID = randomUUID();
      const [{ insertId: addressId }] = await db.insert(addressEndpoints).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        address,
        uuid: addressUUID,
        serverId,
      });

      // Create route
      const routeUUID = randomUUID();
      const routeToken = randomAlphaNumeric(8);
      const [{ insertId: routeId }] = await db.insert(routes).values({
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        spamMode: "Mark",
        name,
        serverId,
        domainId,
        endpointId: addressId,
        endpointType: "AddressEndpoint",
        token: routeToken,
        uuid: routeUUID,
        mode: "Endpoint",
      });

      return {
        credential: {
          name,
          key: credentialKey,
          credentialId,
        },
        address: {
          addressId,
        },
        route: {
          routeId,
          routeEmail: `${routeToken}@${process.env.SERVER_ROUTES_DOMAIN}`,
        },
      };
    },
    {
      body: t.Object({
        serverId: t.Number(),
        name: t.String(),
        address: t.String(),
        domainId: t.Number(),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
