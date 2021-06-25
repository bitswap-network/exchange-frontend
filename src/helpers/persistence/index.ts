import { IdentityUser } from "../../interfaces/identity/User";
export const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key: string) => {
    const data: string | null = localStorage.getItem(key);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            return parsed;
        } catch (e) {
            console.error(e);
            removeData(key);
        }
    } else {
        return null;
    }
};

export const removeData = (key: string) => {
    localStorage.removeItem(key);
};

export const setIdentityUsers = (users: IdentityUser) => {
    saveData("identityUsers", users);
};

export const logout = () => {
    console.log("log out");
    removeData("user");
    removeData("identityUsers");
    removeData("token");
};
