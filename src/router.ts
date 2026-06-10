import { Hono } from "hono";
import { latestMovies } from "./api/latest";
import { mostWatchedMovies } from "./api/most-watched";

const router = new Hono();

router.get("/list/latest", latestMovies);
router.get("/list/most-watched", mostWatchedMovies);

export { router };
