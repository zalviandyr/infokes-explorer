import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../utils/env";
import * as schema from "./schema";

// Client PostgreSQL
const client = postgres(env.DATABASE_URL, { max: 1 });

// Drizzle ORM instance
export const db = drizzle(client, { schema });
