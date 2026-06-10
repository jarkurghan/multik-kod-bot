import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { handleUpdate } from "@/bot.ts";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

app.post("/bot", handleUpdate);
app.use("/*", serveStatic({ root: "./web-dist" }));

export default app;

// import { startBot } from "@/bot.ts";

// startBot();
