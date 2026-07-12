const API_URL = "http://localhost:5000/api/story";

export async function generateLegacy(answers) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate story");
    }

    return await response.json();
}