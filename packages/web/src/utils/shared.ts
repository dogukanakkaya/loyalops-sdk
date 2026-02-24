export function parseUserIdFromToken(token: string): string {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])) as { sub?: string };
        if (!payload.sub) throw new Error();
        return payload.sub;
    } catch {
        throw new Error("[LoyalOps] Could not parse user ID from userToken — ensure it is a valid JWT with a 'sub' claim.");
    }
}
