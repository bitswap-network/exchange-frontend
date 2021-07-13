import { authClient } from "../index";

export const getUserData = async () => {
    return await authClient.get("/user/data");
};
export const getUserProfile = async (username: string) => {
    return await authClient.get(`/user/profile/${username}`);
};

export const getTransactions = async () => {
    return await authClient.get(`/user/transactions`);
};

export const getTransactionById = async (id: string) => {
    return await authClient.get(`/user/transaction/${id}`);
};

export const getOrders = async () => {
    return await authClient.get(`/user/orders`);
};

export const getNotifs = async () => {
    return await authClient.get(`/user/notifications`);
};

export const getIsHolder = async () => {
    return await authClient.get(`/user/isCoinHolder`);
};

export const updateName = async (name: string) => {
    return await authClient.put(`/user/update-name`, {
        name: name,
    });
};

export const updateEmail = async (email: string) => {
    return await authClient.put(`/user/update-email`, {
        email: email,
    });
};

export const updateProfile = async (email: string, name: string) => {
    return await authClient.put(`/user/update-profile`, {
        email: email,
        name: name,
    });
};

export const resendVerificationEmail = async () => {
    return await authClient.get(`/user/resend-verification`);
};

export const verifyBitclout = async (depth?: number) => {
    return await authClient.get(`/user/verify-bitclout/${depth ? depth : 10}`);
};
