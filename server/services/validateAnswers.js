// Mirrors the questions the interview asks (see src/data/questions.js on
// the frontend) so a blank/missing answer can't reach story generation just
// because someone bypassed the UI and hit this endpoint directly.
// "gender" is intentionally excluded - it's optional ("Prefer not to say").
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
