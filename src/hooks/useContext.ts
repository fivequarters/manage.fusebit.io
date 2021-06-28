import constate from "constate";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";

const _useContext = () => {
    const LS_KEY = `T29M03eleloegehOxGtpEPel18JfM3djp5pUL4Jm`;
    const [userData, setUserData] = useState<User>({});

    useEffect(() => {
        const __userData = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
        if (__userData.token) setUserData(__userData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const auth = (__userData: User) => {
        setUserData(__userData);
        localStorage.setItem(LS_KEY, JSON.stringify(__userData));
    }

    return {
        userData,
        auth
    };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };