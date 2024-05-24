import { connection as rawMySqlConnection, db } from "./db";
import { Name, eq, sql } from "drizzle-orm";
import { relations } from 'drizzle-orm';
import { customAlphabet } from "nanoid";
import {
  organizations,
  domains,
  credentials,
  organizationIpPools,
  servers,
  webhooks,
  httpEndpoints,
  routes,
  addressEndpoints,
} from "./schema";

export const randomAlphaNumeric = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomAlphabetic = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomAlphaNumSymbol = customAlphabet(
  "!$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomLowercase = customAlphabet("abcdefghijklmnopqrstuvwxyz");
export const randomUppercase = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
export const randomNumeric = customAlphabet("0123456789");
export const randomSymbols = customAlphabet("!$%&*", 2);

export function generatekey(length: number): string {
  // Generate a random key of the required length
  let key = randomAlphaNumeric(length);

  // Extract characters from the generated key
  const chars = key.split("");

  // Shuffle the characters to increase randomness
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]]; // Swap elements
  }

  // Ensure at least three random symbols are included
  const symbolIndex1 = Math.floor(Math.random() * length);
  const symbolIndex2 = Math.floor(Math.random() * length);
  const symbolIndex3 = Math.floor(Math.random() * length);
  chars[symbolIndex1] = randomSymbols(1); // Replace a character with a random symbol
  chars[symbolIndex2] = randomSymbols(1); // Replace another character with a random symbol
  chars[symbolIndex3] = randomSymbols(1); // Replace another character with a random symbol

  // Join the characters to form the final key
  key = chars.join("");

  return key;
}

// Define relations
export const credentialsRelations = relations(credentials, ({ one }) => ({
  route: one(routes, {
    fields: [credentials.name], // Match by credentials name
    references: [routes.name]
  })
}));

export const routesRelations = relations(routes, ({ one }) => ({
  endpoint: one(addressEndpoints, {
    fields: [routes.endpointId], // Match by endpointId in routes
    references: [addressEndpoints.id]
  })
}));

export async function fetchRouteAndAddressEndpoint(name: string, address: string, serverid: string) {
  try {
      // Step 1: Query for the Route Based on Name
      const route = await db.query.routes.findFirst({
          where: eq(routes.name, name),
      });

      if (!route) {
          throw new Error(`Route not found for name: ${name}`);
      }

      const endpointId = route.endpointId;

      // Step 2: Query for the Address Endpoint Row using the stored endpointId
      const addressEndpoint = await db.query.addressEndpoints.findFirst({
          where: eq(addressEndpoints.id, endpointId),
      });

      if (!addressEndpoint) {
          throw new Error(`Address endpoint not found for route: ${name}`);
      }

      // Step 3: Update the Address Endpoint with the new address
      await db.update(addressEndpoints)
          .set({
              address: address,
              updatedAt: sql`CURRENT_TIMESTAMP`
          })
          .where({ id: addressEndpoint.id });

      // Log the retrieved route and address endpoint
      console.log("Route:", route.name);
      console.log("Updated Address Endpoint:", address);

      // Return the updated address details along with the route name and endpointId
      return {
          name: route.name,
          endpointId: endpointId
      };
  } catch (error: any) {
      console.error("An error occurred:", error.message || 'An error occurred');
      return null; // Return null to indicate failure
  }
}
