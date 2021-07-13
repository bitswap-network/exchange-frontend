import { authClient } from "../index";

export const depositBitcloutPreflightTxn = async (value: number) => {
    return await authClient.post("/gateway/deposit/bitclout-preflight", {
        value: value,
    });
};
export const withdrawBitcloutPreflightTxn = async (value: number) => {
    return await authClient.post("/gateway/withdraw/bitclout-preflight", {
        value: value,
    });
};
export const cancelDeposit = async (id: string) => {
    return await authClient.get(`/gateway/deposit/cancel/${id}`);
};

export const depositBitclout = async (transactionHex: string, transactionIDBase58Check: string, value: number) => {
    return await authClient.post("/gateway/deposit/bitclout", {
        transactionHex: transactionHex,
        transactionIDBase58Check: transactionIDBase58Check,
        value: value,
    });
};
export const depositEth = async () => {
    return await authClient.get("/gateway/deposit/eth");
};

export const withdrawBitclout = async (value: number) => {
    return await authClient.post("/gateway/withdraw/bitclout", {
        value: value,
    });
};
export const withdrawEth = async (value: number, withdrawAddress: string) => {
    return await authClient.post("/gateway/withdraw/eth", {
        value: value,
        withdrawAddress: withdrawAddress,
    });
};
