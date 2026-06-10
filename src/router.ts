import { Hono } from "hono";
import { latestMovies, latestViews } from "./api/latest";
import { mostWatchedMovies, mostWatchedMoviesToday, mostWatchedMovieToday } from "./api/most-watched";

const router = new Hono();

router.get("/list/latest", latestMovies);
router.get("/list/latest/view", latestViews);
router.get("/list/most-watched", mostWatchedMovies);
router.get("/list/most-watched/today", mostWatchedMoviesToday);
router.get("/list/most-watched/today/1", mostWatchedMovieToday);

export { router };
