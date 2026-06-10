import { Hono } from "hono";
import { handleUpdate } from "@/bot.ts";
import { router } from "@/router.ts";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => c.text("Hello Hono!"));
app.post("/bot", handleUpdate);
app.route("/api", router);

export default app;

// import { startBot } from "@/bot.ts";

// startBot();
