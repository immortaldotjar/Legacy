import crypto from "crypto";

// Backs the /story route guard: the server sets a signed, httpOnly cookie
// the moment a story is genuinely generated. The frontend checks for a
// valid cookie before rendering /story. Because it's httpOnly it can't be
// read or forged from devtools/localStorage the way the story data itself
// can - only this server, holding SESSION_SECRET, can produce a value that
// passes isSessionValid().

const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.SESSION_SECRET) {
    console.warn(
        "SESSION_SECRET is not set in .env - using a random secret generated at " +
        "startup instead. That's fine for local dev, but every restart invalidates " +
        "all outstanding sessions, and it won't work across multiple server " +
        "instances. Set SESSION_SECRET in .env for anything beyond local dev."
    );
}

export const SESSION_COOKIE_NAME = "legacy_story_session";
export const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour - comfortably covers reading/refreshing the story page

function sign(encodedPayload) {
    return crypto.createHmac("sha256", SECRET).update(encodedPayload).digest("hex");
}

export function createSessionCookieValue() {
    const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function isSessionValid(cookieValue) {
    if (!cookieValue || typeof cookieValue !== "string" || !cookieValue.includes(".")) {
        return false;
    }

    const [encodedPayload, signature] = cookieValue.split(".");
    if (!encodedPayload || !signature) return false;

    const expectedSignature = sign(encodedPayload);

    const providedBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const signatureValid =
        providedBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(providedBuffer, expectedBuffer);

    if (!signatureValid) return false;

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
        return typeof payload.exp === "number" && Date.now() < payload.exp;
    } catch {
        return false;
    }
}
