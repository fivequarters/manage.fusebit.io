import constate from "constate";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";

const LS_KEY = `T29M03eleloegehOxGtpEPel18JfM3djp5pUL4Jm`;
export const readLocalData = () => JSON.parse(localStorage.getItem(LS_KEY) || "{}");

const _useContext = () => {
    const [userData, setUserData] = useState<User>({});

    useEffect(() => {
        const __userData = readLocalData();
        if (__userData.token) setUserData(__userData);
        else if (window.location.href.indexOf('logged-out-error') < 0) window.location.href = `/logged-out-error`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const auth = (__userData: User) => {
        setUserData(__userData);
        localStorage.setItem(LS_KEY, JSON.stringify(__userData));
    }

    const logout = () => {
        setUserData({});
        localStorage.setItem(LS_KEY, JSON.stringify({}));
        window.location.reload();
    }

    return {
        userData,
        auth,
        logout
    };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };