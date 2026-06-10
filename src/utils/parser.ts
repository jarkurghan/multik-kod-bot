export const descToJson = (description: string | null) => {
    const [title, info, plot] = (description || "\n\n\n\n").split("\n\n");

    return { title, info, plot };
};
