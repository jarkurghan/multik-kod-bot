import { DATABASE_URL } from "./src/utils/constants.ts";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url: DATABASE_URL },
});
