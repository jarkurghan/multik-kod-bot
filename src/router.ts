import { Hono } from "hono";
import { latestMovies, latestViews } from "./api/latest";
import { mostWatchedMovies, mostWatchedMoviesToday, mostWatchedMovieToday } from "./api/most-watched";
import { seriesList, seriesEpisodes, sendMovie } from "./api/series";

const router = new Hono();

router.get("/list/series", seriesList);
router.get("/list/series/:code", seriesEpisodes);
router.get("/list/latest", latestMovies);
router.get("/list/latest/view", latestViews);
router.get("/list/most-watched", mostWatchedMovies);
router.get("/list/most-watched/today", mostWatchedMoviesToday);
router.get("/list/most-watched/today/1", mostWatchedMovieToday);
router.get("/list/send/:code/:chat_id", sendMovie);

export { router };
