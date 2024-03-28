import { customAlphabet } from "nanoid";
import { pgTable, integer, varchar, text, } from 'drizzle-orm/pg-core';
 // Import necessary functions from drizzle-orm
import { eq, sql, relations } from "drizzle-orm";
import { db } from "./src/db";
import { routes, addressEndpoints, credentials } from "./src/schema";
import { routesRelations, credentialsRelations }from "./src/utils";

async function fetchRouteAndAddressEndpoint(name: string, address: stringServer) {
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


// Call the function with the name of the route
fetchRouteAndAddressEndpoint('A00004', 'test666@domain.com');
