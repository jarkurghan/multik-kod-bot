export const descToJson = (description: string | null) => {
    const [title, info, plot] = (description || "\n\n\n\n").split("\n\n");
    const infoArr = info.split("\n");

    const year = infoArr
        .find((e) => e.includes("Yil"))!
        .split(":")[1]
        .trim();

    const genres = infoArr
        .find((e) => e.includes("Janr"))!
        .split(":")[1]
        .trim()
        .split("#")
        .map((e) => e.trim());

    const duration = infoArr
        .find((e) => e.includes("Davomiyligi"))!
        .split(":")[1]
        .trim();

    const irating = infoArr
        .find((e) => e.includes("IMDb reyting"))!
        .split(":")[1]
        .trim();

    const match = irating.match(/^([\d.]+)\s*\((\d+)\s+ovoz\)$/);
    const rating = match![1];
    const vote = match![2];

    return { title, info, plot, year, rating, vote, genres, duration };
};
