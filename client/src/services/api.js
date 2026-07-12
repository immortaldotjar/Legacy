const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/story`;

export async function generateLegacy(answers) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(answers),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to generate story");
    }

    return await response.json();
}
export async function hasStorySession() {
    try {
        const response = await fetch(`${API_URL}/session`, {
            credentials: "include",
        });
        if (!response.ok) return false;
        const data = await response.json();
        return Boolean(data.authorized);
    } catch {
        return false;
    }
}
