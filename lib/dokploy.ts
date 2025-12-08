

export const getDokployUserByEmail = async (email: string) => {
    const DOKPLOY_URL = process.env.DOKPLOY_URL;
    const DOKPLOY_SECRET = process.env.DOKPLOY_SECRET;

    if (!DOKPLOY_URL || !DOKPLOY_SECRET) {
        throw new Error("Missing DOKPLOY_URL or DOKPLOY_SECRET env variables");
    }

    try {
        const response = await fetch(`${DOKPLOY_URL}/api/user.all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': DOKPLOY_SECRET,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const users = await response.json();
        const user = users.find((u: any) => u.user.email === email);

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error fetching Dokploy user:", error);
        return null;
    }
};
