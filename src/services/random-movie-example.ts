import { ilike, not, sql } from "drizzle-orm";
import { sendErrorLog } from "./log";
import { movie } from "@/db/schema";
import { db } from "@/db/client";

const FALLBACK = "<blockquote>Masalan, <b>hayvonlar shahri 2</b> multfilm kodi - <b>M319</b></blockquote>";

export async function getRandomMovieExample(): Promise<string> {
    const [mov] = await db
        .select()
        .from(movie)
        .where(not(ilike(movie.code, "%n%")))
        .orderBy(sql`random()`)
        .limit(1);

    if (!mov) {
        sendErrorLog({ event: "random movie olishda", error: new Error("Movie not found") });
        return FALLBACK;
    }

    if (!mov.posts) {
        const [ep] = await db
            .select()
            .from(movie)
            .where(ilike(movie.code, mov.code + "n%"))
            .orderBy(sql`random()`)
            .limit(1);

        if (!ep) {
            sendErrorLog({ event: "random episode olishda", error: new Error("Episode not found") });
            return FALLBACK;
        }

        const movtitle = (ep.description || "").split("\n")[0].trim();
        const eptitle = (ep.description || "").split("\n")[1].trim();
        const code = ep.code;

        return `<blockquote>Masalan, <b>${movtitle} — ${eptitle}</b> multfilm kodi - <b>${code}</b></blockquote>`;
    } else {
        const title = (mov.description || "").split("\n")[0].trim();
        const code = mov.code;

        return `<blockquote>Masalan, <b>${title}</b> multfilm kodi - <b>${code}</b></blockquote>`;
    }
}
