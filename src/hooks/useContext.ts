import constate from "constate";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import { useGetAuthLink } from "../hooks/useGetAuthLink";

const LS_KEY = `T29M03eleloegehOxGtpEPel18JfM3djp5pUL4Jm`;
export const readLocalData = () => JSON.parse(localStorage.getItem(LS_KEY) || "{}");

const _useContext = () => {
    const [userData, setUserData] = useState<User>({});
    const { getAuthLink } = useGetAuthLink();

    useEffect(() => {
        const __userData = readLocalData();
        if (__userData.token) setUserData(__userData);
        else if (window.location.href.indexOf('logged-out') < 0) {
            localStorage.setItem("redirect", window.location.pathname + window.location.search);
            window.location.href = getAuthLink();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const auth = (__userData: User) => {
        setUserData(__userData);
        localStorage.setItem(LS_KEY, JSON.stringify(__userData));
    }

    const logout = () => {
        setUserData({});
        localStorage.setItem(LS_KEY, JSON.stringify({}));
        window.location.href = `https://fusebit.auth0.com/v2/logout?returnTo=http%3A%2F%2F${window.location.host}`;
    }

    return {
        userData,
        auth,
        logout
    };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };