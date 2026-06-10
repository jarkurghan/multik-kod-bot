export const descToJson = (description: string | null) => {
    const [title, info, plot] = (description || "\n\n\n\n").split("\n\n");
    const infoArr = info.split("\n");

    const year1 = infoArr.find((e) => e.includes("Yil"));
    const year = year1 ? year1.split(":")[1].trim() : undefined;

    const genres1 = infoArr.find((e) => e.includes("Janr"));
    const genres = genres1
        ? genres1
              .split(":")[1]
              .trim()
              .split("#")
              .map((e) => e.trim())
              .slice(1)
        : undefined;

    const duration1 = infoArr.find((e) => e.includes("Davomiyligi"));
    const duration = duration1 ? duration1.split(":")[1].trim() : undefined;

    const irating1 = infoArr.find((e) => e.includes("IMDb reyting"));
    const irating = irating1 ? irating1.split(":")[1].trim() : undefined;

    const match = irating?.match(/^([\d.]+)\s*\((\d+)\s+ovoz\)$/);
    const rating = match && match[1] ? match[1] : undefined;
    const vote = match && match[2] ? match[2] : undefined;

    return { title, info, plot, year, rating, vote, genres, duration };
};
