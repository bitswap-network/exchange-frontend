import { client, authClient } from "../index";
import { saveData } from "../../helpers/persistence";

export const verifyToken = async () => {
    try {
        const response = await authClient.get("/auth/verifytoken");
        return response.status === 204;
    } catch (e) {
        return false;
    }
};

export const login = async (publicKey: string, identityJWT: string) => {
    return await client
        .post("/auth/login", {
            publicKey: publicKey,
            identityJWT: identityJWT,
        })
        .then((response) => {
            if (response.status === 200) {
                saveData("publicKey", response.data.wallet.bitclout.publicKey);
                saveData("user", response.data.user);
                saveData("token", response.data.token);
            }
        });
};

export const fetchBitcloutProfile = async (publicKey: string, username?: string) => {
    return await client.post("/auth/fetch-profile", {
        publicKey: publicKey,
        username: username ? username : "",
    });
};

export const register = async (publicKey: string, email: string, name: string) => {
    return await client.put("/auth/register", {
        publicKey: publicKey,
        email: email,
        name: name,
    });
};
