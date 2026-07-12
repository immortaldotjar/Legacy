const REQUIRED_FIELDS = [
    "name",
    "passion",
    "beginning",
    "challenge",
    "motivation",
    "achievement",
    "future",
];

export function findMissingFields(answers) {
    return REQUIRED_FIELDS.filter((key) => {
        const value = answers?.[key];
        return typeof value !== "string" || value.trim().length === 0;
    });
}
