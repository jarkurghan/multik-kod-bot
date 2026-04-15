import { db, pool } from "@/db/client";
import { mbu, movie } from "@/db/schema";
import { formatLogError } from "@/services/log";
import { sendLog } from "@/services/log";

const resetTodayCounters = async () => {
    await db.update(mbu).set({ today_count: 0 });
    await db.update(movie).set({ today_count: 0 });
};

async function main() {
    try {
        await resetTodayCounters();
        await pool.end();
    } catch (err) {
        await sendLog(`<b>scheduler/counter</b>\n<pre>${formatLogError(err)}</pre>`, { parse_mode: "HTML" });
        try {
            await pool.end();
        } catch (err) {
            console.log(err);
        }
        process.exit(1);
    }
}

void main();
