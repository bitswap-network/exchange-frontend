import { atom, selector } from "recoil";
import { verifyToken } from "../services/auth";
import { getData, logout } from "../helpers/persistence";
import { User } from "../interfaces/User";
import { IdentityUsers } from "../interfaces/identity/User";

export const orderModalState = atom({
    key: "orderModalState",
    default: false,
});

export const orderInfoModalState = atom({
    key: "orderInfoModalState",
    default: [false, null],
});

export const userState = atom({
    key: "userState",
    default: getData("user") ? (getData("user") as User) : null,
});

export const tokenState = atom({
    key: "tokenState",
    default: getData("token") ? (getData("token") as string) : "",
});

export const loggedInState = selector({
    key: "isLoggedIn",
    get: async ({ get }) => {
        const user = get(userState);
        if (user) {
            return await verifyToken();
        } else {
            logout();
            return false;
        }
    },
});

export const identityUsers = atom({
    key: "identityUsers",
    default: getData("identityUsers") ? (getData("identityUsers") as IdentityUsers) : null,
});
export const currentPublicKey = atom({
    key: "publicKey",
    default: getData("publicKey") ? (getData("publicKey") as string) : "",
});
