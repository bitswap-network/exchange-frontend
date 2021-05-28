import { atom, selector } from "recoil"
import { verifyToken } from "../services/auth"
import { getData, removeData, saveData } from "../helpers/persistence"
import { User } from "../interfaces/User"
import { IdentityUsers } from "../interfaces/identity/User"

export const userState = atom({
    key: "userState",
    default: getData("user") as User,
})

export const tokenState = atom({
    key: "tokenState",
    default: getData("token") as string,
})

export const loggedInState = selector({
    key: "isLoggedIn",
    get: async ({ get }) => {
        const user = get(userState)
        console.log(user)
        if (user) {
            return await verifyToken()
        } else {
            removeData("user")
            removeData("token")
            return false
        }
    },
})

export const identityUsers = atom({
    key: "identityUsers",
    default: getData("identityUsers") as IdentityUsers,
})
export const currentPublicKey = atom({
    key: "publicKey",
    default: getData("publicKey") as string,
})
